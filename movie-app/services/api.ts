// SETUP A CONFIGURATION OBJECT FOR THE API
export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3/',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers:{
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
    }
}

export const fetchMovies = async({query}: {query: string} ) => {
    // DEFINE THE API ENDPOINT
    const endpoint = query 
        ? `${TMDB_CONFIG['BASE_URL']}/search/movie?query=${encodeURIComponent(query)}` // GETS THE MOVIES BASED ON THE WHAT THE USER HAS TYPED IN THE SEARCH BAR
        : `${TMDB_CONFIG['BASE_URL']}/discover/movie?sort_by=popularity.desc` // GETS THE POPULAR MOVIES

    // SEND A GET REQUEST TO THE API
    const response = await fetch(endpoint, {
        method: "GET",
        headers: TMDB_CONFIG['headers']
    });

    // CHECK IF THE RESPONSE IF SUCCESSFUL
    if(!response.ok){
        // @ts-ignore
        throw new Error('Failed to fetch movies', response.statusText)
    }

    // FORMAT THE DATA AS JSON
    const data = await response.json()
    
    // RETURN THE DATA
    return data.results;
}

