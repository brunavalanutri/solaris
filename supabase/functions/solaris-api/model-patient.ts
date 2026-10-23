import {newState,dateToday,type Person} from './model.ts';
export function modelPatient(id:string,email:string){
 const today=dateToday();const day=(n:number)=>new Date(Date.parse(today+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
 const state=newState('fictional-team','equipe@solaris.test','Equipe fictícia');
 state.config={title:'Paciente modelo · dados fictícios',start:day(-14),scoringStart:day(-7),end:day(42),support:'Exemplo de acompanhamento: as orientações reais serão definidas pela sua equipe.'};
 const me:Person={id,email,name:'Paciente modelo',displayName:'Modelo',role:'participante',active:true,isModel:true,consent:true,goal:'Conhecer a jornada da participante no Solaris.',plan:'PLANO FICTÍCIO\n\nNeste espaço, a paciente encontra as orientações individualizadas disponibilizadas pela nutricionista. Este texto é apenas um exemplo de apresentação.',bio:'Perfil fictício para conhecer o aplicativo.'};
 state.people.push(me);
 for(const week of state.weeks)Object.assign(week,{main:'Organizar a rotina conforme as orientações da equipe.',food:'Praticar atenção durante uma refeição.',move:'Realizar o movimento combinado com a equipe.',care:'Reservar um momento de autocuidado.',advice:'A constância nasce dos cuidados possíveis na sua rotina.'});
 state.entries.push({id:'example-habits',person:id,date:today,type:'habits',value:{water:2,sleep:7,mood:4,notes:'Registro fictício para visualizar o acompanhamento.'},points:5,status:'validado'},{id:'example-mission',person:id,date:today,type:'mission:main',value:{label:state.weeks[1].main},points:15,status:'validado'},{id:'example-history',person:id,date:day(-1),type:'mission:care',value:{label:'Momento de autocuidado — exemplo'},points:10,status:'validado'},{id:'example-checkin',person:id,date:day(-2),type:'checkin',value:{adherence:4,energy:4,digestion:'Exemplo fictício',wins:'Consegui organizar minha rotina.',difficulty:'Ajustar os horários.',question:'Exemplo de pergunta para a equipe.',reply:'Aqui aparecerá a resposta da profissional.'},points:20,status:'validado'});
 state.appointments.push({id:'example-evaluation',person:id,date:day(1)+'T09:00',type:'Avaliação intermediária',location:'Local demonstrativo'},{id:'example-event',person:'*',date:day(3)+'T18:00',type:'Evento da turma',location:'Encontro fictício'});
 state.evaluations.push({id:'example-measurement',person:id,date:day(-7),weight:'65',muscle:'25',fat:'28',waist:'75',notes:'Valores totalmente fictícios, apenas para visualizar a tela.'});
 state.posts.push({id:'example-post',person:id,name:'Paciente modelo',text:'Este é um exemplo de publicação da comunidade. Esta conta não mostra publicações reais.',date:new Date().toISOString(),hidden:false,reported:false});
 return {state,me,revision:-1};
}
