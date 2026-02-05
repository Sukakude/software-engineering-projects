import { Client, TablesDB, Query, ID } from "react-native-appwrite"

// SETUP DATABASE CONFIGURATIONS
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_TABLE_ID!;

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

// Initialize TablesDB service
const tables = new TablesDB(client)

/* THIS FUNCTION IS RESPONSIBLE FOR TRACKING USER SEARCHES */
export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        const result = await tables.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [Query.equal('searchTerm', query)]
        })

        // check if a record exists
        if(result.total > 0){
            const existingMovie = result.rows[0];
            await tables.updateRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: existingMovie.$id,
                data: {
                    count: existingMovie.count + 1
                }
            })
        }
        else{
            // CREATE A NEW RECORD
            await tables.createRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: ID.unique(),
                data: {
                    title: movie.title,
                    searchTerm: query,
                    movie_id: movie.id,
                    count: 1,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                }
            })
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/* */
export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await tables.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [
                Query.limit(5), 
                Query.orderDesc('count')
            ] // GETS THE TOP 5 SEARCHED MOVIES
        })
        return result.rows as unknown as TrendingMovie[];
    } catch (error) {
        console.log(error);
        return undefined;
    }
}