import simpleGit from 'simple-git';

const sleep = async (ms) => new Promise((resolve) => {
    setTimeout(() => {resolve(ms)}, ms)
});

const init = async () => {
    const git = await simpleGit();

    const branches = await git.branch(['-l']);

    // async function* deleteBranch(branches) {
    //     for (const branchName of branches) {
    //         const diffs = await git.log([`master..${branchName}`]);
    //         const diffsTotal = diffs.total;
    //         //console.log(branchName)
    //         if (diffsTotal === 0) {
    //             console.log(branchName, ' - дубликат мастера');
    //             await git.branch(['-d', branchName]);
    //             console.warn('Ветка', branchName, 'удалена');
    //         }
    //         const ms = await sleep(500)
    //         yield ms;
    //     }
    // }

    //console.log(JSON.stringify(diffs, null, 4));
    //console.log(JSON.stringify(diffs, null, 4));

    const branchCollection = branches?.all
        ?.filter(branchName => branchName !== 'master' && branchName !== 'main-dev')
        ?.map((branchName, index) => new Promise(async (resolve) => {
            const diffs = await git.log([`master..${branchName}`]);
            const diffsTotal = diffs.total;
            //console.log(branchName)
            let isRemoved = false;
            if (diffsTotal === 0) {
                await git.branch(['-d', branchName]);
                isRemoved = true;
            }
            const ms = await sleep(1000 * (index+1));
            console.log(ms);
            resolve({
                branchName,
                isRemoved,
                diffsTotal,
            })
        })) || []

    let ms = 0;

    //const branchCollection = branches?.all?.filter(branchName => branchName !== 'master' && branchName !== 'main-dev') || []

    for await (const brunchInfo of branchCollection) {
        const {branchName, isRemoved, diffsTotal} = brunchInfo;
        if (isRemoved) {
            console.log(branchName, ' - дубликат мастера');
            console.warn('Ветка', branchName, 'удалена');
        }
        else {
            console.log(`${branchName} имеет с мастером ${diffsTotal} разных коммитов`);
        }
    }

}

init();




