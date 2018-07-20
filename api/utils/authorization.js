
permit = (...allowed) => {
    const isAllowed = (groups) => {
        groups.forEach(group => {
            if (allowed.includes(group)) {
                return true
            }
        });
        return false;
    }


    return (req, res, next) => {
        if (req.headers["x-groups"] && isAllowed(req.headers["x-groups"].split(" "))) {
            next()
        }
        else {
            res.status(403).json({
                error: {
                    message: "Not authorized.",
                    description: "You are not authorized to access this resource."
                }
            })
        }

    }
}

module.exports = {
    permit,
};