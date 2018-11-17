import server from './app';

const PORT = 3000;
// choose port of process (for heroku) or 3000 (for development)
server.listen(process.env.PORT || PORT, () => {
    console.log('Express server listening on port ' + PORT);
});