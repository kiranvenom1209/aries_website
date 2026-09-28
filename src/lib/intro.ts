/** Session flag: once the preloader sequence has played in a tab, later full loads skip it. */
export const INTRO_SESSION_KEY = 'hsm-aries-intro'

/**
 * Inlined into <head> so it runs before first paint: a repeat load in the same session never
 * flashes the loader, because `html.preloader-skip` hides it (shell.css) until SitePreloader
 * unmounts it.
 */
export const INTRO_SKIP_SCRIPT = `try{if(sessionStorage.getItem('${INTRO_SESSION_KEY}'))document.documentElement.classList.add('preloader-skip')}catch(e){}`
