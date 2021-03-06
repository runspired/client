import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  model(params) {
    let name = params.name.replace(/%2F/i, '/');
    let list = this.modelFor('admin.review');

    let addon = this.get('store').query('addon', { filter: { name, hidden: [true, false] }, include: 'latest-addon-version,versions,maintainers,keywords,reviews,reviews.version,categories', page: { limit: 1 } }, { reload: true }).then((addons) => {
      return addons.get('firstObject');
    });

    let data = {
      addon,
      list,
      categories: this.get('store').findAll('category', { include: 'subcategories' })
    };

    return hash(data);
  },
  titleToken(model) {
    return model.addon.get('name');
  },
  actions: {
    error() {
      this.replaceWith('model-not-found');
    }
  }
});
