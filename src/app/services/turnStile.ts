declare var turnstile: any
declare var globalToken: any
export const importTurnStile = async () =>{
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    document.head.appendChild(script)
    script.addEventListener('load', (ts) => {

            turnstile.render('#ts-container', {
                sitekey: '0x4AAAAAAAVqd3Q0Le6TMHMl',
                callback: function(token) {
                    globalToken = token
                    console.log(`Challenge Success ${token}`);
                },
            });

        
    })
}
