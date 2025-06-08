// Wait for DOM to be ready then start extension
function initExtension() {
    console.log('[FACEIT Extension] Starting extension...');
    const steamid = getSteamID();
    console.log('[FACEIT Extension] Extracted Steam ID:', steamid);
    loadFaceITProfile(steamid);
    addGameLinks();
}

// Add links to supported game sections
function addGameLinks() {
    console.log('[FACEIT Extension] Adding game links...');
    
    // Game configuration mapping
    const gameConfigs = {
        // CS2/Counter-Strike 2
        '730': {
            name: 'CS2',
            newsUrl: 'https://eloking.com/blog/cs',
            boostUrl: 'https://eloking.com/cs/rank-boost',
            newsLabel: 'News',
            boostLabel: 'Rank up',
            newsIcon: 'guide',
            boostIcon: 'recommendation'
        },
        // Dota 2
        '570': {
            name: 'Dota 2',
            newsUrl: 'https://eloking.com/blog/dota2',
            boostUrl: 'https://eloking.com/dota2-boost',
            newsLabel: 'News',
            boostLabel: 'Rank up',
            newsIcon: 'guide',
            boostIcon: 'recommendation'
        },
        // Rocket League
        '252950': {
            name: 'Rocket League',
            newsUrl: 'https://eloking.com/blog/rocket-league',
            boostUrl: 'https://eloking.com/rocket-league',
            newsLabel: 'News',
            boostLabel: 'Rank up',
            newsIcon: 'guide',
            boostIcon: 'recommendation'
        },
        // Overwatch 2
        '2357570': {
            name: 'Overwatch 2',
            newsUrl: 'https://eloking.com/blog/overwatch',
            boostUrl: 'https://eloking.com/overwatch-boost',
            newsLabel: 'News',
            boostLabel: 'Rank up',
            newsIcon: 'guide',
            boostIcon: 'recommendation'
        },
        // Marvel Rivals
        '2767030': {
            name: 'Marvel Rivals',
            newsUrl: 'https://eloking.com/blog/marvel-rivals',
            boostUrl: 'https://eloking.com/marvel-rivals-boost',
            newsLabel: 'News',
            boostLabel: 'Rank up',
            newsIcon: 'guide',
            boostIcon: 'recommendation'
        },
        // Path of Exile
        '238960': {
            name: 'Path of Exile',
            newsUrl: 'https://eloking.com/blog/poe2',
            boostUrl: 'https://eloking.com/poe2/marketplace',
            newsLabel: 'News',
            boostLabel: 'Marketplace',
            newsIcon: 'guide',
            boostIcon: 'inventory'
        },
        // Path of Exile 2
        '2694490': {
            name: 'Path of Exile 2',
            newsUrl: 'https://eloking.com/blog/poe2',
            boostUrl: 'https://eloking.com/poe2/marketplace',
            newsLabel: 'News',
            boostLabel: 'Marketplace',
            newsIcon: 'guide',
            boostIcon: 'inventory'
        }
    };
    
    // Also check games by content/name patterns for better coverage
    const gameNamePatterns = {
        'cs2': { newsUrl: 'https://eloking.com/blog/cs', boostUrl: 'https://eloking.com/cs/rank-boost', newsLabel: 'News', boostLabel: 'Rank up' },
        'counter-strike': { newsUrl: 'https://eloking.com/blog/cs', boostUrl: 'https://eloking.com/cs/rank-boost', newsLabel: 'News', boostLabel: 'Rank up' },
        'dota': { newsUrl: 'https://eloking.com/blog/dota2', boostUrl: 'https://eloking.com/dota2-boost', newsLabel: 'News', boostLabel: 'Rank up' },
        'rocket league': { newsUrl: 'https://eloking.com/blog/rocket-league', boostUrl: 'https://eloking.com/rocket-league', newsLabel: 'News', boostLabel: 'Rank up' },
        'overwatch': { newsUrl: 'https://eloking.com/blog/overwatch', boostUrl: 'https://eloking.com/overwatch-boost', newsLabel: 'News', boostLabel: 'Rank up' },
        'marvel rivals': { newsUrl: 'https://eloking.com/blog/marvel-rivals', boostUrl: 'https://eloking.com/marvel-rivals-boost', newsLabel: 'News', boostLabel: 'Rank up' },
        'path of exile': { newsUrl: 'https://eloking.com/blog/poe2', boostUrl: 'https://eloking.com/poe2/marketplace', newsLabel: 'News', boostLabel: 'Marketplace' }
    };

    // Check each game by app ID
    Object.keys(gameConfigs).forEach(appId => {
        const config = gameConfigs[appId];
        
        // Find game elements with multiple search patterns
        const gameSelectors = [
            `a[href*="appid=${appId}"]`,
            `a[href*="app/${appId}"]`,
            `a[href*="steamcommunity.com/app/${appId}"]`
        ];
        
        // Add game name-based selectors for additional coverage
        if (config.name === 'CS2') {
            gameSelectors.push('a[href*="Counter-Strike"], a[href*="counter-strike"]');
        } else if (config.name === 'Dota 2') {
            gameSelectors.push('a[href*="Dota"], a[href*="dota"]');
        } else if (config.name === 'Rocket League') {
            gameSelectors.push('a[href*="Rocket"], a[href*="rocket"]');
        } else if (config.name === 'Overwatch 2') {
            gameSelectors.push('a[href*="Overwatch"], a[href*="overwatch"]');
        } else if (config.name === 'Marvel Rivals') {
            gameSelectors.push('a[href*="Marvel"], a[href*="marvel"]');
        } else if (config.name.includes('Path of Exile')) {
            gameSelectors.push('a[href*="Path"], a[href*="path"], a[href*="Exile"], a[href*="exile"]');
        }
        
        const gameElements = document.querySelectorAll(gameSelectors.join(', '));
        
        if (gameElements.length > 0) {
            console.log(`[FACEIT Extension] Found ${config.name} game section`);
            
            gameElements.forEach(element => {
                // Find the game container first, then look for stats section within it
                let gameContainer = element.closest('.recent_game_content');
                let gameStatsSection = gameContainer ? gameContainer.querySelector('.game_info_stats') : null;
                
                if (gameStatsSection) {
                    // Check if we already added links to this stats section
                    if (gameStatsSection.querySelector('.eloking-game-links')) {
                        return; // Skip if already processed
                    }
                    
                    console.log(`[FACEIT Extension] Adding links for ${config.name}`);
                    
                    // Look for existing publishedfilecounts container within stats section
                    let linksContainer = gameStatsSection.querySelector('.game_info_stats_publishedfilecounts');
                    
                    if (!linksContainer) {
                        // Create the stats rule separator if it doesn't exist
                        if (!gameStatsSection.querySelector('.game_info_stats_rule')) {
                            const ruleDiv = document.createElement('div');
                            ruleDiv.className = 'game_info_stats_rule';
                            gameStatsSection.appendChild(ruleDiv);
                        }
                        
                        // Create a new publishedfilecounts container inside stats section
                        linksContainer = document.createElement('div');
                        linksContainer.className = 'game_info_stats_publishedfilecounts';
                        gameStatsSection.appendChild(linksContainer);
                    }
                    
                    // Add marker to prevent duplicate processing
                    linksContainer.classList.add('eloking-game-links');
                    
                    // Create News link
                    const newsLink = document.createElement('span');
                    newsLink.className = 'published_file_count_ctn';
                    newsLink.innerHTML = `
                        <span class="published_file_icon ${config.newsIcon}"></span>
                        <a class="published_file_link" href="${config.newsUrl}" target="_blank">${config.newsLabel}</a>
                    `;
                    
                    // Create Boost/Marketplace link
                    const boostLink = document.createElement('span');
                    boostLink.className = 'published_file_count_ctn';
                    boostLink.innerHTML = `
                        <span class="published_file_icon ${config.boostIcon}"></span>
                        <a class="published_file_link" href="${config.boostUrl}" target="_blank">${config.boostLabel}</a>
                    `;
                    
                    // Add the links to the container
                    linksContainer.appendChild(newsLink);
                    linksContainer.appendChild(boostLink);
                    
                    console.log(`[FACEIT Extension] Successfully added ${config.name} game links`);
                }
            });
        } else {
                         console.log(`[FACEIT Extension] No ${config.name} game section found on this profile`);
         }
     });
     
     // Check games by name patterns as fallback
     Object.keys(gameNamePatterns).forEach(gameName => {
         const config = gameNamePatterns[gameName];
         
         // Find game elements by text content
         const allGameLinks = document.querySelectorAll('.game_name a, .whiteLink');
         const gameElements = Array.from(allGameLinks).filter(link => 
             link.textContent.toLowerCase().includes(gameName.toLowerCase())
         );
         
         if (gameElements.length > 0) {
             console.log(`[FACEIT Extension] Found ${gameName} game by name pattern`);
             
             gameElements.forEach(element => {
                 // Find the game container first, then look for stats section within it
                 let gameContainer = element.closest('.recent_game_content');
                 let gameStatsSection = gameContainer ? gameContainer.querySelector('.game_info_stats') : null;
                 
                 if (gameStatsSection) {
                     // Check if we already added links to this stats section
                     if (gameStatsSection.querySelector('.eloking-game-links')) {
                         return; // Skip if already processed
                     }
                     
                     console.log(`[FACEIT Extension] Adding links for ${gameName} (by name)`);
                     
                     // Look for existing publishedfilecounts container within stats section
                     let linksContainer = gameStatsSection.querySelector('.game_info_stats_publishedfilecounts');
                     
                     if (!linksContainer) {
                         // Create the stats rule separator if it doesn't exist
                         if (!gameStatsSection.querySelector('.game_info_stats_rule')) {
                             const ruleDiv = document.createElement('div');
                             ruleDiv.className = 'game_info_stats_rule';
                             gameStatsSection.appendChild(ruleDiv);
                         }
                         
                         // Create a new publishedfilecounts container inside stats section
                         linksContainer = document.createElement('div');
                         linksContainer.className = 'game_info_stats_publishedfilecounts';
                         gameStatsSection.appendChild(linksContainer);
                     }
                     
                     // Add marker to prevent duplicate processing
                     linksContainer.classList.add('eloking-game-links');
                     
                     // Determine icons based on game type
                     const newsIcon = 'guide';
                     const boostIcon = gameName.includes('path of exile') ? 'inventory' : 'recommendation';
                     
                     // Create News link
                     const newsLink = document.createElement('span');
                     newsLink.className = 'published_file_count_ctn';
                     newsLink.innerHTML = `
                         <span class="published_file_icon ${newsIcon}"></span>
                         <a class="published_file_link" href="${config.newsUrl}" target="_blank">${config.newsLabel}</a>
                     `;
                     
                     // Create Boost/Marketplace link
                     const boostLink = document.createElement('span');
                     boostLink.className = 'published_file_count_ctn';
                     boostLink.innerHTML = `
                         <span class="published_file_icon ${boostIcon}"></span>
                         <a class="published_file_link" href="${config.boostUrl}" target="_blank">${config.boostLabel}</a>
                     `;
                     
                     // Add the links to the container
                     linksContainer.appendChild(newsLink);
                     linksContainer.appendChild(boostLink);
                     
                     console.log(`[FACEIT Extension] Successfully added ${gameName} game links (by name)`);
                 }
             });
         } else {
             console.log(`[FACEIT Extension] No ${gameName} game section found by name pattern`);
         }
     });
}

// Run when DOM is ready with retry mechanism for Steam page loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initExtension, 1000); // Wait 1 second for Steam page to fully load
    });
} else {
    setTimeout(initExtension, 1000); // Wait 1 second for Steam page to fully load
}

// Create global variables
let id,
    level,
    levelImg,
    username,
    country,
    banned,
    banReason,
    elo = '',
    verified = '-',
    lastMatch = '-',
    registred = '';

function loadFaceITProfile(steamid) {
    // Check if steamID was recieved successfully
    if (steamid === null) {
        console.log('[FACEIT Extension] No Steam ID found, stopping extension');
        return;
    }

    console.log('[FACEIT Extension] Loading FACEIT profile for Steam ID:', steamid);
    
    // Get FaceIT profile using Steam ID lookup
    const playerUrl = 'https://open.faceit.com/data/v4/players?game=cs2&game_player_id=' + steamid;
    console.log('[FACEIT Extension] Making API request to:', playerUrl);
    
    chrome.runtime.sendMessage(playerUrl,
        result => {
            console.log('[FACEIT Extension] Player API response:', result);
            onFaceITDirectProfileLoaded(result);
        }
    );
}

async function onFaceITDirectProfileLoaded(result) {
    console.log('[FACEIT Extension] Processing direct FACEIT profile result');

    if (result && result.player_id) {
        const profile = result;
        console.log('[FACEIT Extension] Found FACEIT profile:', profile);

        //Fill in start data
        id = profile.player_id;
        username = profile.nickname;
        country = profile.country;
        level = profile.games && profile.games.cs2 ? profile.games.cs2.skill_level : 1;
        levelImg = chrome.runtime.getURL(`./img/levels/${level}.svg`);
        
        console.log('[FACEIT Extension] Profile data:', { id, username, country, level });

        updateDOM();

        // Check for bans using new API
        chrome.runtime.sendMessage('https://open.faceit.com/data/v4/players/' + id + '/bans',
            result => {
                if (result && result.items && result.items.length > 0) {
                    banned = true;
                    banReason = result.items[0].reason;
                    updateDOM();
                }
            }
        );

        // Get additional data using new API
        chrome.runtime.sendMessage('https://open.faceit.com/data/v4/players/' + id,
            result => {
                if (result) {
                    if (result.games && result.games.cs2) {
                        elo = result.games.cs2.faceit_elo;
                    }
                    verified = result.verified ? 'Yes' : 'No';
                    registred = new Date(result.activated_at).toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' });
                    updateDOM();
                }
            }
        );

        // Get last match date from history
        chrome.runtime.sendMessage(`https://open.faceit.com/data/v4/players/${id}/history?game=cs2&offset=0&limit=1`,
            result => {
                console.log('[FACEIT Extension] Player history response:', result);
                
                if (result && result.items && result.items.length > 0) {
                    const lastMatchTimestamp = result.items[0].finished_at;
                    if (lastMatchTimestamp) {
                        const lastMatchDate = new Date(lastMatchTimestamp * 1000);
                        const now = new Date();
                        const diffDays = Math.floor((now - lastMatchDate) / (1000 * 60 * 60 * 24));
                        
                        if (diffDays === 0) {
                            lastMatch = 'Today';
                        } else if (diffDays === 1) {
                            lastMatch = 'Yesterday';
                        } else if (diffDays < 7) {
                            lastMatch = `${diffDays} days ago`;
                        } else {
                            lastMatch = lastMatchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        }
                        
                        console.log('[FACEIT Extension] Last match:', lastMatch);
                    }
                }
                
                updateDOM();
            }
        );

    } else {
        console.log('[FACEIT Extension] No FACEIT profile found for this user');
    }

}

// Keep the old function as fallback for search-based lookup
async function onFaceITProfileLoaded(result) {
    console.log('[FACEIT Extension] Processing FACEIT profile result');
    const profile = await getMainProfile(result);

    if (profile !== null) {
        console.log('[FACEIT Extension] Found FACEIT profile:', profile);

        //Fill in start data
        id = profile.player_id;
        username = profile.nickname;
        country = profile.country;
        level = profile.games && profile.games.cs2 ? profile.games.cs2.skill_level : 1;
        levelImg = chrome.runtime.getURL(`./img/levels/${level}.svg`);
        
        console.log('[FACEIT Extension] Profile data:', { id, username, country, level });

        updateDOM();

        // Check for bans using new API
        chrome.runtime.sendMessage('https://open.faceit.com/data/v4/players/' + id + '/bans',
            result => {
                if (result && result.items && result.items.length > 0) {
                    banned = true;
                    banReason = result.items[0].reason;
                    updateDOM();
                }
            }
        );

        // Get additional data using new API
        chrome.runtime.sendMessage('https://open.faceit.com/data/v4/players/' + id,
            result => {
                if (result) {
                    if (result.games && result.games.cs2) {
                        elo = result.games.cs2.faceit_elo;
                    }
                    verified = result.verified ? 'Yes' : 'No';
                    registred = new Date(result.activated_at).toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' });
                    updateDOM();
                }
            }
        );

        // Get last match date from history
        chrome.runtime.sendMessage(`https://open.faceit.com/data/v4/players/${id}/history?game=cs2&offset=0&limit=1`,
            result => {
                console.log('[FACEIT Extension] Player history response:', result);
                
                if (result && result.items && result.items.length > 0) {
                    const lastMatchTimestamp = result.items[0].finished_at;
                    if (lastMatchTimestamp) {
                        const lastMatchDate = new Date(lastMatchTimestamp * 1000);
                        const now = new Date();
                        const diffDays = Math.floor((now - lastMatchDate) / (1000 * 60 * 60 * 24));
                        
                        if (diffDays === 0) {
                            lastMatch = 'Today';
                        } else if (diffDays === 1) {
                            lastMatch = 'Yesterday';
                        } else if (diffDays < 7) {
                            lastMatch = `${diffDays} days ago`;
                        } else {
                            lastMatch = lastMatchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        }
                        
                        console.log('[FACEIT Extension] Last match:', lastMatch);
                    }
                }
                
                updateDOM();
            }
        );

    } else {
        console.log('[FACEIT Extension] No FACEIT profile found for this user');
    }

}

function updateDOM() {
    console.log('[FACEIT Extension] Updating DOM...');
    
    // Insert FACEIT stats specifically into the profile left column
    let insertionPoint = null;
    
    // Target the profile left column specifically
    const profileLeftCol = document.querySelector('.profile_leftcol');
    if (profileLeftCol) {
        insertionPoint = profileLeftCol;
        console.log('[FACEIT Extension] Found profile left column for insertion');
    } else {
        console.log('[FACEIT Extension] Profile left column not found, trying fallback options');
        // Fallback options if profile_leftcol is not available
        const fallbackSelectors = ['.profile_customization_area', '.profile_content'];
        for (let selector of fallbackSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                insertionPoint = element;
                console.log('[FACEIT Extension] Using fallback selector:', selector);
                break;
            }
        }
    }

    if (!insertionPoint) {
        console.log('[FACEIT Extension] Could not find suitable insertion point for FACEIT stats section');
        console.log('[FACEIT Extension] Available elements:');
        console.log('[FACEIT Extension] .profile_leftcol:', document.querySelector('.profile_leftcol'));
        console.log('[FACEIT Extension] .profile_customization_area:', document.querySelector('.profile_customization_area'));
        console.log('[FACEIT Extension] .profile_content:', document.querySelector('.profile_content'));
        return;
    }

    //Add the box with the data
    let textNode = document.createElement("div");
    textNode.id = 'facex';
    textNode.innerHTML = `
    <div class="profile_customization">
        <div class="profile_customization_header">
            <span>Faceit Stats <span style="color:#9b9b9b">by Eloking</span></span>
            <a href="https://eloking.com" target="_blank" class="facex_header_logo_link">
                <img class="facex_header_logo" src="${chrome.runtime.getURL('img/logo.png')}" alt="Eloking Logo">
            </a>
        </div>
        <div class="profile_customization_block">
            <div class="favoritegroup_showcase">
                <div class="showcase_content_bg">
                    <div class="facex_content favoritegroup_showcase_group showcase_slot">                  
                        <div class="facex_single_line">
                            <img class="levelbox" src="${levelImg}">
                            <div class="facex_name_section">
                                <a class="favoritegroup_name whiteLink" target="_blank" href="https://www.faceit.com/en/players/${username}">
                                    <img class="facex_country" title="${country}" src="https://community.fastly.steamstatic.com/public/images/countryflags/${country.toLowerCase()}.gif">
                                    ${username}
                                </a>
                                <span class="facex_description">
                                    ${((banned) ? `<span alt="${banReason}" class="faceit-banned">${banReason}</span>` : `Registered ${registred}`)}
                                </span>
                            </div>
                            <div class="facex_stat">
                                <div class="value">${elo}</div>
                                <div class="label">ELO</div>
                            </div>
                            <div class="facex_stat">
                                <div class="value">${lastMatch}</div>
                                <div class="label">Last match</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    if (document.getElementById('facex')) {
        console.log('[FACEIT Extension] Updating existing FACEIT element');
        document.getElementById('facex').innerHTML = textNode.innerHTML;
    } else {
        console.log('[FACEIT Extension] Inserting new FACEIT element as separate section');
        // Insert the FACEIT stats as the first element in the insertion point
        // This will make it appear as a separate section before other content
        insertionPoint.insertBefore(textNode, insertionPoint.firstChild);
    }
    
    console.log('[FACEIT Extension] DOM update completed');
}

// getLevel function no longer needed with new API structure

/**
 * Gets profile with CS2
 * @param {*} result 
 * @returns 
 */
async function getMainProfile(result) {
    console.log('[FACEIT Extension] Getting main profile from search results');
    
    if (!result || !result.items) {
        console.log('[FACEIT Extension] Invalid search result structure:', result);
        return null;
    }
    
    let profile = null;
    const allPlayers = result.items;
    console.log('[FACEIT Extension] Found', allPlayers.length, 'players in search results');
    
    if (allPlayers.length > 1) {
        allPlayers.map(async (user, index) => {
            console.log('[FACEIT Extension] Checking player', index, ':', user.nickname, 'with games:', user.games ? Object.keys(user.games) : 'no games');
            if (user.games && user.games.cs2) {
                console.log('[FACEIT Extension] Found CS2 player:', user.nickname);
                profile = allPlayers[index];
            }
        });
    } else if (allPlayers.length === 1) {
        console.log('[FACEIT Extension] Only one player found, using:', allPlayers[0].nickname);
        profile = allPlayers[0];
    }

    console.log('[FACEIT Extension] Selected profile:', profile ? profile.nickname : 'none');
    return profile;
}


/**
 * Gets steamID from page content
 * @returns string
 */
function getSteamID() {
    console.log('[FACEIT Extension] Attempting to extract Steam ID...');
    
    // Method 1: Try to get from report popup (when logged in)
    const abuseElements = document.getElementsByName("abuseID");
    if (abuseElements && abuseElements[0]) {
        console.log('[FACEIT Extension] Found Steam ID from abuse report form');
        return abuseElements[0].value;
    }

    // Method 2: Try to extract from URL if it's a steamID64 profile
    const urlParts = window.location.pathname.split('/');
    if (urlParts.includes('profiles') && urlParts.length > 2) {
        const potentialSteamID = urlParts[urlParts.indexOf('profiles') + 1];
        if (potentialSteamID && potentialSteamID.match(/^\d{17}$/)) {
            console.log('[FACEIT Extension] Found Steam ID from URL:', potentialSteamID);
            return potentialSteamID;
        }
    }

    // Method 3: Try to extract from global variables in page scripts
    try {
        const scripts = document.querySelectorAll('script');
        for (let script of scripts) {
            const scriptContent = script.innerHTML;
            
            // Look for various steamid patterns
            const patterns = [
                /g_steamID\s*=\s*"(\d{17})"/,
                /steamid["']?\s*:\s*["']?(\d{17})["']?/,
                /"steamid":"(\d{17})"/,
                /steamID64["']?\s*:\s*["']?(\d{17})["']?/,
                /profile_steamid64["']?\s*:\s*["']?(\d{17})["']?/
            ];
            
            for (let pattern of patterns) {
                const match = scriptContent.match(pattern);
                if (match && match[1]) {
                    console.log('[FACEIT Extension] Found Steam ID from script:', match[1]);
                    return match[1];
                }
            }
        }
    } catch (e) {
        console.log('[FACEIT Extension] Error extracting steamID from scripts:', e);
    }

    // Method 4: Try to extract from data attributes
    try {
        const selectors = [
            '[data-steamid]',
            '[data-profile-steamid]',
            '.profile_header [data-steamid]'
        ];
        
        for (let selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                const steamid = elements[0].getAttribute('data-steamid') || elements[0].getAttribute('data-profile-steamid');
                if (steamid) {
                    console.log('[FACEIT Extension] Found Steam ID from data attribute:', steamid);
                    return steamid;
                }
            }
        }
    } catch (e) {
        console.log('[FACEIT Extension] Error extracting steamID from data attributes:', e);
    }

    // Method 5: Try to find steamID64 in page HTML content
    try {
        const pageContent = document.documentElement.innerHTML;
        const steamidMatch = pageContent.match(/\b(765611[0-9]{11})\b/); // SteamID64 always starts with 765611
        if (steamidMatch && steamidMatch[1]) {
            console.log('[FACEIT Extension] Found Steam ID from page content:', steamidMatch[1]);
            return steamidMatch[1];
        }
    } catch (e) {
        console.log('[FACEIT Extension] Error with page content steamID extraction:', e);
    }

    console.log('[FACEIT Extension] Could not extract steamID from page');
    return null;
}
