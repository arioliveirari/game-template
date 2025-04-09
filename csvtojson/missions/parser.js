const fs = require('fs');
const path = require('path');


const missionsPath = path.join(__dirname, 'missions.json');
const missionsParsedPath = path.join(__dirname, 'missions-parsed.json');

fs.readFile(missionsPath, 'utf8', (err, data) => {
    if (err) {
    console.error(err);
    return;
  }
    const missions = JSON.parse(data);
    const parsedMissions = missions.map((mission) => {
        return {
            ...mission,
            id: Number(mission.id),
            time: Number(mission.time),
            rewardId: Number(mission.rewardId),
            relatedMission: Number(mission.relatedMission),
            configMinigameId: Number(mission.configMinigameId),
            requirements: JSON.parse(mission.requirements),
            group: mission.group.split(',').map((group) => group.trim()),
            available: mission.available === 'TRUE',
            done: mission.done === 'TRUE',
            inProgress: mission.inProgress === 'TRUE',
            isMinigame: mission.isMinigame === 'TRUE',
            draw: mission.draw === 'TRUE',
            keywords: mission.keywords === 'null' ? null : mission.keywords,
        };
    });
    fs.writeFile(missionsParsedPath, JSON.stringify(parsedMissions), (err) => {
        if (err) {
        console.error(err);
        return;
        }
        console.log('File has been written');
    });
});

