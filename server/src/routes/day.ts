import { prisma } from './../lib/prisma';
import { FastifyInstance } from "fastify";
import { z } from 'zod';
import dayjs from 'dayjs';

export async function dayRoutes(app: FastifyInstance){
  app.get('/day', async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
    });

    const { date } = getDayParams.parse(request.query);
    const parseDate = dayjs(date).startOf('day');
    const weekDay = parseDate.get('day');

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        habitsWeekDays: {
          some: {
            week_day: weekDay
          }
        }
      }
    });

    const day = await prisma.day.findUnique({
      where: {
        date: parseDate.toDate(),
      },
      include: {
        dayHabits: true
      }
    });
    const completedHabits = day?.dayHabits.map(dayHabit => {
      return dayHabit.habit_id;
    }) ?? [];
    return {
      possibleHabits,
      completedHabits
    }
  });

}
