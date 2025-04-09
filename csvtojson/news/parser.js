const fs = require('fs');
const path = require('path');


const newsPath = path.join(__dirname, 'news.json');
const newsParsedPath = path.join(__dirname, 'news-parsed.json');

fs.readFile(newsPath, 'utf8', (err, data) => {
    if (err) {
    console.error(err);
    return;
  }
    const news = JSON.parse(data);
    const parsedNews = news.map((_new) => {
        return {
            ..._new,
            id: Number(_new.id),
            title: _new.title,
            missionId: Number(_new.missionId),
            image: _new.image,
            time: (_new.time == "NULL") ? null : Number(_new.time),
            description: _new.description,
            rewardId: (_new.rewardId == "NULL") ? null : Number(_new.rewardId),
            requirements: (_new.requirements == "NULL") ? null : _new.requirements.split(',').map((requirements) => Number(requirements.trim())),
            readed: _new.readed === 'TRUE',
        };
    });
    fs.writeFile(newsParsedPath, JSON.stringify(parsedNews), (err) => {
        if (err) {
        console.error(err);
        return;
        }
        console.log('File has been written');
    });
});

