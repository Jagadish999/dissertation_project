class GetOrPostRequest {
    constructor() {

    }

    async sendPostRequest(requiredData, redirectURL) {
        try {
            const response = await fetch(redirectURL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(requiredData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData;

        } 
        catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async sendGetRequest(redirectURL) {
        try {
            const response = await fetch(redirectURL);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData; // Return the response data
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw the error for further handling
        }
    }

    async getBestMove(fenPosition, depthValue, nodeServerUrl) {
        try {
            const response = await fetch(`${nodeServerUrl}/stockfish-api/get-best-move`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ fen: fenPosition, depth: depthValue }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch best move');
            }
    
            const data = await response.json();
            console.log('The best move is:', data.best_move); // Log the best move
            return data.best_move; // Return the best move
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    
}
