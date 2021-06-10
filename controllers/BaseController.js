class BaseController {
  constructor(model) {
    this.model = model;
  }

  fetchUserDetails(params) {
    return this.model.findOne(params);
  }

  find(params, fields) {
    return this.model.findOne(params, fields ? fields : null);
  }

  findById(id, fields) {
    return this.model.findById(id, fields);
  }

  findAll(params, options, populateModel, fields) {
    params = (params && params instanceof Object) ? params : {};
    let modelRef = this.model.find(params, fields);
    if (options) {
      const { limit, skip, sort, direction, search, searchableFields } = options;
      modelRef = this.buildSearchCriteria(search, searchableFields, modelRef);

      if (limit) {
        modelRef.limit(limit);
      }
      if (skip) {
        modelRef.skip(skip);
      }
      if (sort && direction) {
        let sortParam = {};
        sortParam[sort] = direction;
        modelRef.sort(sortParam)
      }
    }
    if (populateModel) {
      return modelRef;
    } else {
      return modelRef
        .lean()
        .exec();
    }
  }

  buildSearchCriteria(search, searchableFields, modelRef) {
    if (search && searchableFields && searchableFields instanceof Array) {
      let searchConditions = searchableFields
        .map(field => {
          return { [field]: new RegExp(search, "ig") }
        });

      return modelRef.where({ $or: searchConditions });
    }
    return modelRef;
  }

  count(params, search, searchableFields) {
    let modelRef = this.model.countDocuments(params);
    modelRef = this.buildSearchCriteria(search, searchableFields, modelRef);
    return modelRef;
  }

  save(dataModel) {
    return new Promise((resolve, reject) => {
      if (dataModel && dataModel.save instanceof Function) {
        resolve(dataModel.save())
      } else {
        reject('No Savable Model')
      }
    });
  }

  create(payload) {
    let entity = new this.model();
    for (const key in payload) {
      entity[key] = payload[key];
    }
    return entity.save();
  }

  inserAll(dataSet) {
    return this.model.insertMany(dataSet);
  }

  updateAll(dataSet) {
    return this.model.updateMany(dataSet);
  }

  updateField(criteria, fieldNamesWithValues) {
    return this.model.updateOne(criteria, fieldNamesWithValues);
  }

  _processData(payload, result) {
    return new Promise((resolve, reject) => {
      if (Object.keys(payload).length && Object.keys(result).length) {
        for (const key in payload) {
          //result[key] && 
          if (payload[key]) {
            result[key] = payload[key];
          }
        }
        resolve(result);
      } else {
        reject("No Matching result found!");
      }
    })
  }

  truncate() {
    return this.model.remove({});
  }

  delete(params) {
    return this.model.findOneAndRemove(params)
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

}

module.exports = BaseController;