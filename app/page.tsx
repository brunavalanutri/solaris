import Solaris from './solaris';
import {getIdentity} from '@/lib/auth';
export const dynamic='force-dynamic';
export default async function Page(){const identity=await getIdentity();return <Solaris signedIn={!!identity}/>}
