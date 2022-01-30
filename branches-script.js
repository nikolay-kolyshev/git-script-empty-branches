import simpleGit from 'simple-git';


const MASTER_BRANCH = 'origin/master';
const DEV_BRANCH = 'origin/main-dev';

const sleep = async (ms) => new Promise((resolve) => {
    setTimeout(() => {resolve(ms)}, ms)
});

const init = async () => {
    const git = await simpleGit();

    const branches = await git.branch(['-r']);

    //console.log(JSON.stringify(diffs, null, 4));
    //console.log(JSON.stringify(diffs, null, 4));

    const branchCollection = branches?.all
        ?.filter(branchName => branchName !== MASTER_BRANCH && branchName !== DEV_BRANCH)
        ?.map((branchName, index) => new Promise(async (resolve) => {
            const diffs = await git.log([`${MASTER_BRANCH}..${branchName}`]);
            const diffsTotal = diffs.total;
            //console.log(branchName)
            let isRemoved = false;
            if (diffsTotal === 0) {
                await git.push(['-d', 'origin', branchName.replace(/^origin\//, '')]);
                isRemoved = true;
            }
            const ms = await sleep(1000 * (index+1));
            console.log(ms);
            resolve({
                branchName,
                isRemoved,
                diffsTotal,
            })
            /*resolve({
                branchName,
                isRemoved: false,
                diffsTotal: 1,
            })*/
        })) || []

    let ms = 0;


    for await (const brunchInfo of branchCollection) {
        const {branchName, isRemoved, diffsTotal} = brunchInfo;
        if (isRemoved) {
            console.log(branchName, '- дубликат мастера');
            console.warn('Ветка', branchName, 'удалена');
        }
        else {
            console.log(`${branchName} имеет с мастером ${diffsTotal} разных коммитов`);
        }
    }

    //console.log(await git.listRemote(['origin', 'pull-requests/*']));

}

init();




