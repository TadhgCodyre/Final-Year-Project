<img src="front-end/src/img/logo.png" align="right" />

# Virtual Table Quiz Web App

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
    </li>
    <li>
       <a href="#tools">Tools</a>
    </li>
    <li>
       <a href="#feedback">Feedback</a>
    </li>
    <li>
       <a href="#run">Run</a>
    </li>
    <li>
       <a href="#declaration">Declaration</a>
    </li>
  </ol>
</details>

<!-- ABOUT -->
## About
This is my Final Year Project for National University of Ireland Galway. The project is defined by the following statement:<br>
*"Build a web app system that will allow for the design of a table quiz, and for people to play in the quiz. The quiz should
be multiple choice, with a bank of available questions, and bonuses for speed of response. Ideally, people should be able
to play this on their mobile phone, and testing with a sample user base should be part of the project."* <br>

Unit testing is being ran using CircleCI for a CICD environment.

<!-- TOOLS -->
## Tools
- Go
- React
- Local MongoDB server

<!-- FEEDBACK -->
## Feedback
- Google form: https://forms.gle/ARk644tvcQm5g71G7
- Please send all feedback to the form exclusively

<!-- RUN -->
## Run
- Must first create a config.yaml file inside the utils folder.
- Insert the following code: ```mongo: link to remote or local MongoDB database```.
- If you are using a local Mongdb instance, enter the localhost address for it instead.
- To run the Back-End, run ```go run main.go``` inside Back-End folder.
- To run the Front-End, run ```npm start``` inside front-end folder.

<!-- DECLARATION -->
## Declaration
I hereby declare that this final year project, which I now submit for correction, is entirely my own
work and has not been influenced by the work of others except where cited
