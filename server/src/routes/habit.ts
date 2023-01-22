import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { z } from 'zod';
import dayjs from 'dayjs';

export async function habitRoutes(app: FastifyInstance){
  app.post('/habits/create', async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(
        z.number().min(0).max(6)
      )
    });
    const { title, weekDays } = createHabitBody.parse(request.body);

    const today = dayjs().startOf('day').toDate();

    const data = await prisma.habit.create({
      data: {
        title,
        created_at: today,
        habitsWeekDays: {
          create: weekDays.map(weekDay => {
            return {
              week_day: weekDay,
            }
          })
        }
      }
    });

    return {
      data
    }
  });

  app.patch('/habits/:id/toggle', async (request) => {
    const completeToggleHabitParams = z.object({
      id: z.string().uuid(),
    });

    const { id } = completeToggleHabitParams.parse(request.params);
    const today = dayjs().startOf('day').toDate();

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      }
    });

    if(!day){
      day = await prisma.day.create({
        data: {
          date: today
        }
      });
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        }
      }
    });

    if(dayHabit){
      //remover marcação de completo
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id
        }
      })

    } else {
      //completar habito
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        }
      });
    }

  });

  app.get('/habits/summary', async () => {
    const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        (
          SELECT 
            cast(count(*) as float)
          FROM days_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT
            cast(count(*) as float)
          FROM habits_weeks_days HWD
          JOIN habits h
            ON H.id = HWD.habit_id
          WHERE
           HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
           AND H.created_at <= D.date
        ) as amount
      FROM days D
    `
    return summary;
  });
}
