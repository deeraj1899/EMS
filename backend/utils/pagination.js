export function paginate(query, req) {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    return query.skip((page - 1) * limit).limit(limit);
  }
  