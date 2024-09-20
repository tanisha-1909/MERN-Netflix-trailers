

export async function getTrendingTv(req,res) {
	const { id } = req.params;
	try {
		const response= await fetch(`http://www.omdbapi.com/?i=${id}&apikey=3367e218&type=series`);
		
		
		const data = await response.json();
        if (data.Type !== "series") {
            return res.status(404).json({ success: false, message: "No TV series found with this IMDb ID, it's a movie or another type." });
        }

		res.json({ success: true, content: data});
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}
export async function getTvTrailers(req, res) {
    const { id } = req.params; // IMDb ID
    const apiKey = 'AIzaSyBukNbVIQT0rQ3Q3ENi07IbfbhgSNGvmnA';

    try {
        const omdbResponse = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=3367e218&type=series`);
        const movieData = await omdbResponse.json();
        if (movieData.Type !== "series") {
            return res.status(404).json({ success: false, message: "No TV series found with this IMDb ID, it's a movie or another type." });
        }
        if (movieData.Response === "True") {
            const movieTitle = movieData.Title;
            console.log(`Searching for trailer of: ${movieTitle}`);

            // Search for trailers on YouTube
            const youtubeResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(movieTitle + ' trailer')}&key=${apiKey}`);
            const youtubeData = await youtubeResponse.json();

            console.log("YouTube Data:", youtubeData); 

            if (youtubeData.items && youtubeData.items.length > 0) {
                const trailer = youtubeData.items[0]; 
                const videoUrl = `https://www.youtube.com/watch?v=${trailer.id.videoId}`;

                res.json({ success: true, trailerUrl: videoUrl });
            } else {
                res.status(404).json({ success: false, message: `No trailers found for movie: ${movieTitle}` });
            }
        } else {
            res.status(404).json({ success: false, message: `Movie not found for IMDb ID: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export async function getTvDetails(req,res) {
	const { id } = req.params;
	try {
		const response= await fetch(`http://www.omdbapi.com/?i=${id}&apikey=3367e218&type=series`);
		
		
		const data = await response.json();
        if (data.Type !== "series") {
            return res.status(404).json({ success: false, message: "No TV series found with this IMDb ID, it's a movie or another type." });
        }
		res.json({ success: true, content: data});
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}
export async function getSimilarTvs(req, res) {
    const { id } = req.params;
    try {
        
        const movieResponse = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=3367e218&type=series`);
        const movieData = await movieResponse.json();

        if (!movieData.Genre) {
            return res.status(404).json({ success: false, message: "Movie genre not found" });
        }

        
        const genre = movieData.Genre.split(', ')[0]; // Taking the first genre for simplicity
        const similarMoviesResponse = await fetch(`http://www.omdbapi.com/?s=${genre}&type=series&apikey=3367e218`);
        const similarMoviesData = await similarMoviesResponse.json();

        res.json({ success: true, content: similarMoviesData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export async function getTvsByCategory(req,res){
   
    const movieIDs= ['tt0816692','tt6473300','tt32832648','tt14392248','tt9544034','tt14650074','tt0411008','tt6468322','tt0182576'];
    try{
        const randomIndex=Math.floor(Math.random() * movieIDs.length);
        const randomId=movieIDs[randomIndex];
        const movieResponse = await fetch(`http://www.omdbapi.com/?i=${randomId}&apikey=3367e218&type=series`);
        const movieData = await movieResponse.json();

        res.json({success:true,content:movieData});

    }catch(error){
        res.status(500).json({success:false,message: "Internal Server Error"});
    }
}

