const app = require('./app.js');

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
    console.log(`Palette-picker is running http://localhost:${app.get('port')}`)
});