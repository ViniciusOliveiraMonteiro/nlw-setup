import { Check } from "phosphor-react";
import * as Checkbox from '@radix-ui/react-checkbox';
import { FormEvent, useState } from "react";
import { api } from "../lib/axios";

const avaliableWeekDays = [
  'Domingo', 
  'Segunda-feira', 
  'Terça-feira', 
  'Quarta-feira', 
  'Quinta-feira', 
  'Sexta-feira', 
  'Sábado'
];

export function NewHabitForm(){
  const [title, setTitle] = useState('');
  const [weekDays, setWeekDays] = useState<number[]>([]);
  async function newHabitFormSubmit(event: FormEvent) {
    event.preventDefault();

    if(!title || weekDays.length === 0){
      return;
    }

    await api.post('/habits/create', {
      title,
      weekDays
    });

    setTitle('');
    setWeekDays([]);
    alert('Hábito cadastrado com sucesso!')
  }
  function handleToggleWeekDays(weekDay: number) {
    if(weekDays.includes(weekDay)){
      // const removeSelectedWeekDay = weekDays.filter(day => day !== weekDay).sort();
      setWeekDays(prevState => prevState.filter(day => day !== weekDay).sort());
    }else {
      //const addedWeekDay = [...weekDays, weekDay].sort();
      setWeekDays(prevState => [...prevState, weekDay]);
    }
  }
  return (
    <form onSubmit={newHabitFormSubmit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual o seu comprometimento
      </label>

      <input 
        type="text" 
        name="title" 
        id="title" 
        placeholder="ex.: Exercícios, dormir bem, etc..." 
        autoFocus
        value={title}
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-zinc-900"
        onChange={event => setTitle(event.target.value)}
      />

      <label htmlFor="" className="ont-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="flex flex-col gap-2 mt-3">
        {
          avaliableWeekDays.map((weekDay, index) => {
            return (
              <Checkbox.Root 
                key={weekDay} 
                className="flex items-center gap-3 group focus:outline-none"
                checked={weekDays.includes(index)}
                onCheckedChange={() => handleToggleWeekDays(index)}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center border-2 bg-zinc-900 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background">
                  <Checkbox.Indicator>
                    <Check size={20} className="text-white"/>
                  </Checkbox.Indicator>
                </div>
                <span className="text-white leading-tight">
                  {weekDay}
                </span>
              </Checkbox.Root>
            );
          })
        }
      </div>

      <button
        type="submit"
        className="mt-6 rounded-lg p-4 gap-3 flex items-start font-semibold bg-green-600 justify-center hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        <Check size={20} weight="bold"></Check>
        Confirmar
      </button>
    </form>
  );
}