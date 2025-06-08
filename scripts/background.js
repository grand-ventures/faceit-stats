chrome.runtime.onMessage.addListener(
    function(url, sender, onSuccess) {
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer 012c77ea-7569-4984-b44e-2248c07e73dc',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(responseText => {
                if (!responseText || responseText.trim() === '') {
                    onSuccess({ players: { results: [] } });
                    return;
                }
                
                try {
                    const responseJson = JSON.parse(responseText);
                    onSuccess(responseJson.payload ?? responseJson);
                } catch (parseError) {
                    onSuccess({ players: { results: [] } });
                }
            })
            .catch(error => {
                onSuccess({ players: { results: [] } });
            });
        
        return true;
    }
);