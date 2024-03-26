declare var turnstile: any
export let globalToken = null
export default async function importTurnStile(){
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    document.head.appendChild(script);

    script.addEventListener('load', () => {

            turnstile.render('#ts-container', {
                sitekey: '0x4AAAAAAAVqd3Q0Le6TMHMl',
                callback: (token) => {
                    globalToken = token
                    console.log(`${globalToken}`);
                },
            });

        
    })
}
