import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import clsx from "clsx";
import { BackButton } from "../../components/BackButton/BackButton";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { CheckBox } from "../../components/CheckBox/CheckBox";
import { Loading } from "../../components/Loading/Loading";
import { EmptyHabit } from "../../components/EmptyHabit/EmptyHabit";
import { api } from "../../lib/axios";
import { generateProgressPecentage } from "../../utils/generate-progress-percentage";

interface RouteParams {
  date: string;
}

interface DayInfoProps {
  completed: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[]
}

export function Habit(){
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const route = useRoute();
  const { date } = route.params as RouteParams;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date());

  const habitProgress = dayInfo?.possibleHabits.length ? 
    generateProgressPecentage(dayInfo.possibleHabits.length, completedHabits.length) 
    : 0;

  useEffect(() => {
    fetchHabits();
  }, [])

  async function fetchHabits() {
    try {
      setLoading(true);
      const response = await api.get('/day', { params: {date}})
      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
    } catch (error) {
      console.log(error);
      Alert.alert('Ops', 'Não foi possível carregar suas informações')
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`);
      if(completedHabits.includes(habitId)){
        setCompletedHabits(prevSate => prevSate.filter(prevHabit => prevHabit !== habitId));
      }else {
        setCompletedHabits(prevSate => [...prevSate, habitId]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Ops', 'Não foi possível atualizar o hábito')
    }
  }

  if(loading){
    return (
      <Loading/>
    );
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <BackButton/>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        overScrollMode="never"
      >
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>
        <ProgressBar progress={habitProgress}/>
        <View 
          className={clsx("mt-6",
            {
              ["opacity-50"]: isDateInPast
            }
          )}
        >
          {
            dayInfo?.possibleHabits.length ? 
            dayInfo?.possibleHabits.map(habit => (
              <CheckBox
              key={habit.id}
                title={habit.title}
                checked={completedHabits.includes(habit.id)}
                disabled={isDateInPast}
                onPress={() => handleToggleHabit(habit.id)}
              />
            )) 
            : <EmptyHabit/>
          }
        </View>
        {
          isDateInPast && 
            (
              <Text className="text-white mt-10 text-center">
                Você não pode editar um hábito de uma data passada.
              </Text>
            )
        }
      </ScrollView>
    </View>
  );
}