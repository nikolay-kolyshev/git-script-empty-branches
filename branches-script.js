import simpleGit from 'simple-git';

const init = async () => {
    const git = await simpleGit();

    const branches = await git.branch(['-l']);

    //console.log(JSON.stringify(diffs, null, 4));
    //console.log(JSON.stringify(diffs, null, 4));

    for (const branchName of branches?.all?.filter(branchName => branchName !== 'master' && branchName !== 'main-dev') || []) {
        const diffs = await git.log([`master..${branchName}`]);
        const diffsTotal = diffs.total;
        //console.log(branchName)
        if (diffsTotal === 0) {
            console.log(branchName, ' - дубликат мастера');
            await git.branch(['-d', branchName]);
            console.warn('Ветка', branchName, 'удалена');
        }
    }




}

init();




