var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
async function doCORSRequest(options) {
    //var x = new XMLHttpRequest();
    //x.open(options.method, cors_api_url + options.url);
    /*x.onload = x.onerror = await function() {
        printResult((x.responseText || '')
        );
    };*/

    let test = await $.get(cors_api_url+options.url);

    console.log(test);
    return test;
    //x.send(options.data);
}
