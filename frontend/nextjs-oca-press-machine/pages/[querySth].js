import {useRouter} from 'next/router';

function QuerySomething(){
    const router = useRouter();

    return <h1>Your are querying {router.query.querySth}</h1>;
}

export default QuerySomething;