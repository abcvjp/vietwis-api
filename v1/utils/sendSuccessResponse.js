module.exports = function (res, data = null, options = []) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    let resObject = {success: true};
    options.forEach((x) => {
        resObject = {...resObject, ...x};
    });
    if (data) resObject = {...resObject, data: data};
    res.json(resObject);
};