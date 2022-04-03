# c3
citrushack ayaya

C3 == Citrus C2


## Inspiration

A Command and Control, C2, server is a application for controlling machines.

In this world of ongoing cyber attacks, why are the bad guys the only ones with the fancy dashboards, able to control multiple machines? We set out to create a C2, Command & Control, server that is able to act as both a defender and attacker.
What it does

C3 is a method for controlling multiple machines at once. We set out to create a dashboard that requires agents, the machines, to poll the server and run commands from a queue. These outputs are then placed into a history which can be retrieved at any time by the admin. As with all cybersecurity products, this has the potential to act however the admin desires.
How we built it

## Backend:

- Flask API: Used by client machines to communicate with the C2 server.
- Google Cloud's Firebase's Firestore Storage as our database.
- Rust Websocket API: Used to interface between the flask API, firebase, and the front end.
- Twilio's API is utilized to send text notifications to the administrator of the server when an agent is run on a new machine.
- Google Cloud Compute VM is used to host the Flask and Rust APIs.

Frontend:
- Typescript, Material UI, React Utilizing best functional practices and a modern web framework, we were able to create a fullstack application that is able to effectively control machines.
- Clients (Programs used to communicate between hosts and the server):

  Two clients written in C++. One is for Windows-based operating systems and the other is for unix-based operating systems. These executables are written to leave a small footprint on the system, communicating with the C2 server on a configurable amount of time.

Challenges we ran into

- Websockets gave us more troubl than we thought. Originally we intended have our Flask backend communicate with the frontend using socket.io but the Flask Socket.io library is frustrating and not fun to use. Therefore, we did the logical thing and developed a second API using Rust.

Built With
    c++
    flask
    html5
    javascript
    libcurl
    python
    rust
    socket.io
    twilio
    typescript

Try it out

    citrusc2.tech
