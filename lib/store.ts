import { createAdmin } from './supabase/admin';
import type {State} from './model';
export async function readState(){const db=createAdmin();const {data,error}=await db.from('solaris_state').select('payload,revision').eq('id','main').maybeSingle();if(error)throw new Error('503|Não foi possível abrir o banco Solaris.');return data?{state:data.payload as State,revision:Number(data.revision)}:null;}
export async function initState(state:State){const {error}=await createAdmin().from('solaris_state').insert({id:'main',payload:state,revision:0});if(error&&error.code!=='23505')throw new Error('503|Não foi possível iniciar o programa.');}
export async function compareAndSwap(state:State,revision:number){const {data,error}=await createAdmin().from('solaris_state').update({payload:state,revision:revision+1}).eq('id','main').eq('revision',revision).select('id');if(error)throw new Error('503|Não foi possível salvar no banco Solaris.');return data.length===1;}
