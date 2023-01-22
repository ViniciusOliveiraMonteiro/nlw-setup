import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import Feather from 'react-native-vector-icons/Feather';
import { BackButton } from "../../components/BackButton/BackButton";
import { CheckBox } from "../../components/CheckBox/CheckBox";
import colors from "tailwindcss/colors";
import { api } from "../../lib/axios";

const avaliableWeekDays = [
  'Domingo', 
  'Segunda-feira', 
  'Terça-feira', 
  'Quarta-feira', 
  'Quinta-feira', 
  'Sexta-feira', 
  'Sábado'
];

export function NewHabit(){
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  function handleToogleWeekDay(weekDaysIndex: number){
    if(weekDays.includes(weekDaysIndex)){
      setWeekDays(previewState => previewState.filter(weekDay => weekDay != weekDaysIndex));
    }else{
      setWeekDays(previewState => [...previewState, weekDaysIndex]);
    }
  }

  async function handlerCreateNewHabit() {
    try {
      if(!title.trim() || !weekDays.length){
        return Alert.alert('Novo hábito', 'Informe o nome do hábito e a periodicidade');
      }
      const response = await api.post('/habits/create', {
        title,
        weekDays
      });
      setTitle('');
      setWeekDays([]);

      Alert.alert('Novo hábito', 'Hábito criado com sucesso');
    } catch (error) {
      console.log(error);
      Alert.alert('Ops', 'Não foi possível cadastrar novo hábito');
    }
  }
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <BackButton/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        overScrollMode="never"
      >

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          Qual seu comprometimento
        </Text>

        <TextInput
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="Exercícios, dormir bem, etc..."
          placeholderTextColor={colors.zinc[400]}
          onChangeText={setTitle}
          value={title}
        />

        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          Qual a recorrência
        </Text>
        {
          avaliableWeekDays.map((weekDay, index) => (
            <CheckBox 
              key={weekDay}
              title={weekDay}
              checked={weekDays.includes(index)}
              onPress={() => handleToogleWeekDay(index)}
            />
          ))
        }
        <TouchableOpacity
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          activeOpacity={0.7}
          onPress={handlerCreateNewHabit}
        >
          <Feather
            name="check"
            size={20}
            color={colors.white}
          />
          <Text className="font-semibold text-base text-white ml-2">

          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}