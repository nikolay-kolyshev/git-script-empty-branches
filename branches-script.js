import simpleGit from 'simple-git';

const init = async () => {
    const git = await simpleGit();

    const diffs = await git.log(['master...dev-1']);
    const branches = await git.branch(['-l']);

    //console.log(JSON.stringify(diffs, null, 4));
    console.log(JSON.stringify(branches, null, 4));


}

init();




