chrome.runtime.onMessage.addListener(
    function(url, sender, onSuccess) {
        console.log('[FACEIT Extension Background] Making request to:', url);
        
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer 012c77ea-7569-4984-b44e-2248c07e73dc',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        })
            .then(response => {
                console.log('[FACEIT Extension Background] Response status:', response.status);
                console.log('[FACEIT Extension Background] Response headers:', response.headers);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return response.text(); // Get as text first
            })
            .then(responseText => {
                console.log('[FACEIT Extension Background] Raw response:', responseText);
                
                if (!responseText || responseText.trim() === '') {
                    console.log('[FACEIT Extension Background] Empty response received');
                    onSuccess({ players: { results: [] } }); // Return empty results
                    return;
                }
                
                try {
                    const responseJson = JSON.parse(responseText);
                    console.log('[FACEIT Extension Background] Parsed JSON:', responseJson);
                    onSuccess(responseJson.payload ?? responseJson);
                } catch (parseError) {
                    console.error('[FACEIT Extension Background] JSON parse error:', parseError);
                    console.error('[FACEIT Extension Background] Response text that failed to parse:', responseText);
                    onSuccess({ players: { results: [] } }); // Return empty results on parse error
                }
            })
            .catch(error => {
                console.error('[FACEIT Extension Background] Fetch error:', error);
                onSuccess({ players: { results: [] } }); // Return empty results on error
            });
        
        return true;  // Will respond asynchronously.
    }
);