---
layout: default
title: it's okay to google the answer
tag: software
---

For a long time there was the perception that using Google---and, in turn, sites like [Stack Overflow](https://stackoverflow.com/)---to determine how to implement something in code somehow made an individual a less competent programmer.
Today, the same criticism would likely be levelled at those who use generative AI (or, to use its [proprietary eponym](https://en.wikipedia.org/wiki/Generic_trademark), ChatGPT) for this task.

There are, of course, ways to use both of these tools incorrectly, especially generative AI, where one can [almost literally](https://www.youtube.com/watch?v=TuAsFCcvWPg) ask for a whole piece of software to be created from scratch from an entirely non-technical description (a hazard for safe and maintainable code).
However, for most programmers, it is likely the case that these tools are actually being used correctly: _what_ to implement is known, it is _how_ to implement it that is, effectively, being delegated to these 'knowledge bases'[^1].

Programmers spend years developing the skills required to approach and break down problems (the _what_), something that could be argued defines the discipline.
On the other hand, it is simply not mentally efficient (or, in the case of working across multiple language, feasible) to hold the _how_ in one's head.
So, much like a professional natural language translator looking up a word in a French dictionary, appropriate resources are consulted; the 'grammar' is known but the 'syntax' does not have to be, to borrow a (loose) metaphor.
The translator would not be derided for using the tools at their disposal, and a programmer should not be either.
The site _Let Me Google That_ {% include ref.html ref="'let me google that for you'" %} exists for a reason, after all.

{%
  include figure.html
  src="/assets/images/posts/google-the-answer/let-me-google-that-for-you.png"
  alt="'let me google that for you'"
%}

In the case of generative AI, there would seem to be several steps that can be taken to ensure that it is only ever the _how_ that is asked, and never the _what_.
These can also be reframed as an assessment of whether generative AI is being used correctly.
Suggestions for general good AI practice are added to these steps for good measure, and in each case the model is intentionally anthropomorphised for clarity[^2]:

1. Don't ask extremely high-level questions (this leads to bad code). 
Instead, come up with an overview of the implementation, and then ask for help with very specific parts of that implementation.

2. Ask for more efficient or alternative ways for the code to be written.

3. Cross-check responses from different models (e.g. ChatGPT \[GPT\-_N_\] vs. Claude \[Sonnet\]). Cross-check with Stack Overflow and documentation.

4. Ask follow-up questions if you don't understand any of the output.

It is perhaps also worth acknowledging the other ways generative AI might be used to support the _how_ of programming: thus far, it has effectively been equated with a search engine (over a knowledge base), and in many ways [this is correct](https://tratt.net/laurie/blog/2025/the_llm_for_software_yoyo.html) as large language models (LLMs) do offer a form of _semantic search_ (while acknowledging issues with accuracy).
They can though, of course, perform other (more sophisticated) functions, such as acting as a sounding board for solutions that are already known to be correct.
 
[^1]: Message boards and generative AI are framed as knowledge bases with caution, as there is obviously the chance that both (especially the latter) will provide incorrect information.

[^2]: For a good overview of how language models actually work, see the excellent explanation [here](https://youtu.be/XZJc1p6RE78?si=iJflfj0UixpmRSlI&t=155) (contained within an equally interesting wider topic).