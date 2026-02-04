/*  
    ************** NB **************
    THIS IS A CUSTOM HOOK THAT IS RESPONSIBLE FOR HANDLING API REQUESTS 
    BY ABSTRACTING THE LOGIC FOR FETCH THE DATA AND 
    MANAGING ERROR STATES. 
    IT ALSO TRIGGERS RETRY MECHANISMS WHEN NEEDED.  
*/

import { useEffect, useState } from "react"

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch=true) => {
    /*
        Parameters:
            - fetchFunction: This is a function that is responsible for fetching movies e.g fetching all movies/fetching a single movie etc. 
    
        Returns:
            - Promise<T>: This is a Promise function of a Generic type
    */
    
    // SETUP A NEW STATES
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // CREATE A FUNCTION TO FETCH THE DATA
    const fetchData = async () => {
        try{
            setLoading(true);
            setError(null);
            
            const result = await fetchFunction();

            setData(result);
        }
        catch(err){
            setError(err instanceof Error ? err: new Error('An error occurred'));
        }
        finally{
            setLoading(false);
        }
    }

    // RESET THE STATES
    const reset = () => {
        setData(null);
        setLoading(false);
        setError(null);
    }

    // CHECK IF THE DATA HAS TO BE AUTOMATICALLY FETCHED
    useEffect(() => {
        if(autoFetch){
            fetchData();
        }
    }, [])

    return { data, loading, error, refetch: fetchData, reset }
}

export default useFetch;