import simpleGit from 'simple-git';

const MASTER_BRANCH = 'origin/master';
const DEV_BRANCH = 'origin/main-dev';

/*const sleep = async (ms) => new Promise((resolve) => {
    setTimeout(() => {resolve(ms)}, ms)
});*/

const deleteBranch = (git, branchName) => {
    return new Promise(async (resolve) => {
        const diffs = await git.log([`${MASTER_BRANCH}..${branchName}`]);
        const diffsTotal = diffs.total;
        let isRemoved = false;
        if (diffsTotal === 0) {
            await git.push(['-d', 'origin', branchName.replace(/^origin\//, '')]);
            isRemoved = true;
        }
        resolve({
            branchName,
            isRemoved,
            diffsTotal,
        });
    });
}

const init = async () => {

    const git = await simpleGit();

    const branches = await git.branch(['-r']);

    const branchCollection =
        branches?.all
            ?.filter(branchName => branchName !== MASTER_BRANCH && branchName !== DEV_BRANCH)
            ?.map((branchName) => deleteBranch(git, branchName))
        || [];


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




