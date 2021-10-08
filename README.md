# Mokko -- Frontend

## What is this?

I took the initial idea from [this post](https://notes.andymatuschak.org/Spaced_repetition_systems_can_be_used_to_program_attention): I found the possibility of "gently, recurringly directing myself to ruminate on certain concepts" compelling.

Here's my original spec:

```
- spaced interaction: follows simplified leitner-box sequencing
	- notes aren't flashcards, however: doesn't ask you to answer a question
	- each note is not a fact, but an e.g. claim, or observation, or mental model
	- rather than increasing retrieval strength of note's content, aims to exercise contemplation/investigation of note's content
- in addition to note's content, each interaction provides user with a single question
	- only presents you with one prompt per interaction, but lets you swipe to choose a different prompt if desired
	- user fills out one prompt (via a textbox) to 'complete' the interaction
- next time the note comes up
	- it's got the initial text, but also 
	- the commentar(y/ies) you've added prior (hidden accordion-style?)
```

While working toward an MVP, I replaced:
- the Leitner-box system sequencing with a simple `<select>` that included a ~Fibonacci sequence of days, for greater flexibility; and
- the "_each interaction provides user with a single question_" model with a randomly-selected "prompt-note" to pair with, complement, qualify, contradict, or otherwise Hegel-dialecticify the note-under-contemplation's content.

After working through such options as (_in decreasing order of repugnance_) "ZettelCast", "Reflectric", "Myslennya", and "[Forster](https://www.goodreads.com/quotes/656524-only-connect-that-was-the-whole-of-her-sermon-only)-[Wallace](https://fs.blog/2012/04/david-foster-wallace-this-is-water/) Collider", I settled on the provisional name of "[Mokko](https://en.wiktionary.org/wiki/%E9%BB%99%E8%80%83)", a nice two-syllable Japanese abstract noun to pair with my personal usage of [Anki](https://en.wiktionary.org/wiki/%E6%9A%97%E8%A8%98#Japanese).

And this repo is the frontend for that app!

## How's it work?

Let me begin not with an excuse, or apology, but defiant explanation: I had a vision of a tool, and _I. Wanted. It. Now._ The two frameworks I've worked with the most are React and Rails, and so that's what I decided to use for getting a working prototype out the door.

(_That said, I'd never worked with Hooks before, and so I probably went a little crazy on e.g. using different paradigms for form-handling across pages, keeping global state in a single, top-level_ `useReducer` _Hook, etc._)

Because the authz/authn goal of this app is "_keep any randos that stumble across it from arbitrarily messing with the database, or at least make it difficult enough that they don't bother,_" it uses a JWT kept in `sessionStorage` for validating the user.

Once logged in, there's:
- a listview page for `Decks` (_of `Notes`_).. with CRUDability and access to each `Note`'s details page;
- a listview page for `Notes`, with access to each `Note`'s details page and, uh... pagination?;
- a "review" page, in which new interactions with a given Note's content are sequenced, created, and saved (as a new `Mokko`.)

For styling, it uses [Bulma](https://bulma.io/) for much of the heavy lifting, occasionally abetted by (_I was in a hurry!_) inline `style` props.

## How do I set it up?

It's a `create-react-app` blob o' JS, baby: pull down the repo, run `npm i`, `npm run start`, and you should be greeted with a version running on your local (_worry not; the [backend](https://github.com/ypaulsussman/mokko_api) setup is somewhat more involved._)

You want it deployed remotely, it's just a matter of:
- updating the `API_URL` in `src/constants.jsx`;
- running `npm run build`; then 
- dropping the `build/*` dir on a CDN.

## What's next?

Not much, at least for a while. 

I dropped the app on Netlify/Heroku and used it for six weeks, to 
1. confirm that it engaged recurring focus on ideas that interested me, perhaps even actuating new thoughts or interpretations of those ideas (_success!_); and 
2. surface frictions, deficiencies, bugs, etc that arose during daily usage (_...alas, also success!_)

My initial extrinsic motivation for creating/using this tool, however, was to first populate, then winnow down, topics on which I might conduct PhD research. And that's not on the horizon for severrrrrral years.

(_Moreover, it's something I'd like to eventually share with non/quasi-technical peers for review, and the best way to do that is likely as a native app with eventual cloud-backup. And that means either learning QT or diving back into Electron... both of which are probably even further down the horizon._) 😹 

