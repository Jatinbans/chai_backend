const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
      .then((data) => {
        console.log(data)
        next();
    })
      .catch((error) => console.log(error));
  };
};

export { asyncHandler };
