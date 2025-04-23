const getToDashboard = (req, res) => {
    res.status(200).json({message:"Welcome To Dashboard!"})
}

module.exports = getToDashboard