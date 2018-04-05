'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _pug = require('pug');

var _pug2 = _interopRequireDefault(_pug);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _htmlPdf = require('html-pdf');

var _htmlPdf2 = _interopRequireDefault(_htmlPdf);

var _common = require('./common');

var _common2 = _interopRequireDefault(_common);

var _recipient = require('./recipient');

var _recipient2 = _interopRequireDefault(_recipient);

var _emitter = require('./emitter');

var _emitter2 = _interopRequireDefault(_emitter);

var _i18n = require('../lib/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Generator extends _common2.default {
  constructor(config) {
    super();
    this._recipient = config.recipient ? new _recipient2.default(config.recipient) : new _recipient2.default();
    this._emitter = config.emitter ? new _emitter2.default(config.emitter) : new _emitter2.default();
    this._total_exc_taxes = 0;
    this._total_taxes = 0;
    this._total_inc_taxes = 0;
    this._article = [];
    this._i18nConfigure(config.language);
    this.hydrate(config.global, this._itemsToHydrate());
  }

  get template() {
    return this._template;
  }

  set template(value) {
    this._template = value;
  }

  get lang() {
    return !this._lang ? this._defaultLocale : this._lang;
  }

  set lang(value) {
    const tmp = value.toLowerCase();
    if (!this._availableLocale.includes(tmp)) throw new Error(`Wrong lang, please set one of ${this._availableLocale.join(', ')}`);
    this._lang = tmp;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get order_reference_pattern() {
    return !this._order_reference_pattern ? '$prefix{OR}$date{YYMM}$separator{-}$id{00000}' : this._order_reference_pattern;
  }

  set order_reference_pattern(value) {
    this._order_reference_pattern = value;
  }

  get invoice_reference_pattern() {
    return !this._invoice_reference_pattern ? '$prefix{IN}$date{YYMM}$separator{-}$id{00000}' : this._invoice_reference_pattern;
  }

  set invoice_reference_pattern(value) {
    this._invoice_reference_pattern = value;
  }

  get reference() {
    return this._reference;
  }

  set reference(value) {
    this._reference = value;
  }

  get logo() {
    return this._logo;
  }

  set logo(value) {
    this._logo = value;
  }

  get order_template() {
    return this._order_template;
  }

  set order_template(value) {
    this._order_template = value;
  }

  get invoice_template() {
    return this._invoice_template;
  }

  set invoice_template(value) {
    this._invoice_template = value;
  }

  get order_note() {
    return this._order_note;
  }

  set order_note(value) {
    this._order_note = value;
  }

  get invoice_note() {
    return this._invoice_note;
  }

  set invoice_note(value) {
    this._invoice_note = value;
  }

  get footer() {
    return this._footer;
  }

  set footer(value) {
    this._footer = value;
  }

  get date_format() {
    return !this._date_format ? 'YYYY/MM/DD' : this._date_format;
  }

  set date_format(value) {
    this._date_format = value;
  }

  get date() {
    return !this._date ? (0, _moment2.default)().format(this.date_format) : this._date;
  }

  set date(value) {
    if (!(0, _moment2.default)(value).isValid()) throw new Error('Date not valid');
    this._date = (0, _moment2.default)(value).format(this.date_format);
  }

  get total_exc_taxes() {
    return this._total_exc_taxes;
  }

  set total_exc_taxes(value) {
    this._total_exc_taxes = value;
  }

  get total_taxes() {
    return this._total_taxes;
  }

  set total_taxes(value) {
    this._total_taxes = value;
  }

  get total_inc_taxes() {
    return this._total_inc_taxes;
  }

  set total_inc_taxes(value) {
    this._total_inc_taxes = value;
  }

  get article() {
    return this._article;
  }

  /**
   * @description Set
   * @param value
   * @example article({description: 'Licence', tax: 20, price: 100, qt: 1})
   * @example article([
   *  {description: 'Licence', tax: 20, price: 100, qt: 1},
   *  {description: 'Licence', tax: 20, price: 100, qt: 1}
   * ])
   */
  set article(value) {
    const tmp = value;
    if (Array.isArray(tmp)) {
      for (let i = 0; i < tmp.length; i += 1) {
        this._checkArticle(tmp[i]);
        tmp[i].total_product_without_taxes = this.formatOutputNumber(tmp[i].price * tmp[i].qt);
        tmp[i].total_product_taxes = this.formatOutputNumber(this.round(tmp[i].total_product_without_taxes * (tmp[i].tax / 100)));
        tmp[i].total_product_with_taxes = this.formatOutputNumber(this.round(Number(tmp[i].total_product_without_taxes) + Number(tmp[i].total_product_taxes)));
        tmp[i].price = this.formatOutputNumber(tmp[i].price);
        tmp[i].tax = this.formatOutputNumber(tmp[i].tax);
        this.total_exc_taxes += Number(tmp[i].total_product_without_taxes);
        this.total_inc_taxes += Number(tmp[i].total_product_with_taxes);
        this.total_taxes += Number(tmp[i].total_product_taxes);
      }
    } else {
      this._checkArticle(tmp);
      tmp.total_product_without_taxes = this.formatOutputNumber(tmp.price * tmp.qt);
      tmp.total_product_taxes = this.formatOutputNumber(this.round(tmp.total_product_without_taxes * (tmp.tax / 100)));
      tmp.total_product_with_taxes = this.formatOutputNumber(this.round(Number(tmp.total_product_without_taxes) + Number(tmp.total_product_taxes)));
      tmp.price = this.formatOutputNumber(tmp.price);
      tmp.tax = this.formatOutputNumber(tmp.tax);
      this.total_exc_taxes += Number(tmp.total_product_without_taxes);
      this.total_inc_taxes += Number(tmp.total_product_with_taxes);
      this.total_taxes += Number(tmp.total_product_taxes);
    }
    this._article = this._article ? this._article.concat(tmp) : [].concat(tmp);
  }

  /**
   * @description Reinitialize article attribute
   */
  deleteArticles() {
    this._total_inc_taxes = 0;
    this._total_taxes = 0;
    this._total_exc_taxes = 0;
    this._article = [];
  }

  /**
   * @description Check article structure and data
   * @param article
   * @private
   */
  _checkArticle(article) {
    if (!Object.prototype.hasOwnProperty.call(article, 'description')) throw new Error('Description attribute is missing');
    if (!Object.prototype.hasOwnProperty.call(article, 'tax')) throw new Error('Tax attribute is missing');
    if (!this.isNumeric(article.tax)) throw new Error('Tax attribute have to be a number');
    if (!Object.prototype.hasOwnProperty.call(article, 'price')) throw new Error('Price attribute is missing');
    if (!this.isNumeric(article.price)) throw new Error('Price attribute have to be a number');
    if (!Object.prototype.hasOwnProperty.call(article, 'qt')) throw new Error('Qt attribute is missing');
    if (!this.isNumeric(article.qt)) throw new Error('Qt attribute have to be an integer');
    if (!Number.isInteger(article.qt)) throw new Error('Qt attribute have to be an integer, not a float');
  }

  /**
   * @description Hydrate from configuration
   * @returns {[string,string,string,string]}
   */
  _itemsToHydrate() {
    return ['logo', 'order_template', 'invoice_template', 'date_format', 'order_reference_pattern', 'invoice_reference_pattern', 'order_note', 'invoice_note', 'lang', 'footer'];
  }

  /**
   * @description Hydrate recipient object
   * @param obj
   * @returns {*}
   */
  recipient(obj) {
    if (!obj) return this._recipient;
    return this._recipient.hydrate(obj, this._recipient._itemsToHydrate());
  }

  /**
   * @description Hydrate emitter object
   * @param obj
   * @returns {*}
   */
  emitter(obj) {
    if (!obj) return this._emitter;
    return this._emitter.hydrate(obj, this._emitter._itemsToHydrate());
  }

  /**
   * @description Precompile translation to merging glabal with custom translations
   * @returns {{logo: *, header_date: *, table_information, table_description, table_tax, table_quantity,
   * table_price_without_taxes, table_price_without_taxes_unit, table_note, table_total_without_taxes,
   * table_total_taxes, table_total_with_taxes, fromto_phone, fromto_mail, footer, moment: (*|moment.Moment)}}
   * @private
   */
  _preCompileCommonTranslations() {
    return {
      logo: this.logo,
      header_date: this.date,
      table_information: _i18n2.default.__({ phrase: 'table_information', locale: this.lang }),
      table_description: _i18n2.default.__({ phrase: 'table_description', locale: this.lang }),
      table_tax: _i18n2.default.__({ phrase: 'table_tax', locale: this.lang }),
      table_quantity: _i18n2.default.__({ phrase: 'table_quantity', locale: this.lang }),
      table_price_without_taxes: _i18n2.default.__({ phrase: 'table_price_without_taxes', locale: this.lang }),
      table_price_without_taxes_unit: _i18n2.default.__({ phrase: 'table_price_without_taxes_unit', locale: this.lang }),
      table_note: _i18n2.default.__({ phrase: 'table_note', locale: this.lang }),
      table_total_without_taxes: _i18n2.default.__({ phrase: 'table_total_without_taxes', locale: this.lang }),
      table_total_taxes: _i18n2.default.__({ phrase: 'table_total_taxes', locale: this.lang }),
      table_total_with_taxes: _i18n2.default.__({ phrase: 'table_total_with_taxes', locale: this.lang }),
      fromto_phone: _i18n2.default.__({ phrase: 'fromto_phone', locale: this.lang }),
      fromto_mail: _i18n2.default.__({ phrase: 'fromto_mail', locale: this.lang }),
      footer: this.getFooter(),
      emitter_name: this.emitter().name,
      emitter_street_number: this.emitter().street_number,
      emitter_street_name: this.emitter().street_name,
      emitter_zip_code: this.emitter().zip_code,
      emitter_city: this.emitter().city,
      emitter_country: this.emitter().country,
      emitter_phone: this.emitter().phone,
      emitter_mail: this.emitter().mail,
      recipient_company: this.recipient().company_name,
      recipient_first_name: this.recipient().first_name,
      recipient_last_name: this.recipient().last_name,
      recipient_street_number: this.recipient().street_number,
      recipient_street_name: this.recipient().street_name,
      recipient_zip_code: this.recipient().zip_code,
      recipient_city: this.recipient().city,
      recipient_country: this.recipient().country,
      recipient_phone: this.recipient().phone,
      recipient_mail: this.recipient().mail,
      articles: this.article,
      table_total_without_taxes_value: this.formatOutputNumber(this.total_exc_taxes),
      table_total_taxes_value: this.formatOutputNumber(this.total_taxes),
      table_total_with_taxes_value: this.formatOutputNumber(this.total_inc_taxes),
      template_configuration: this._templateConfiguration(),
      moment: (0, _moment2.default)()
    };
  }

  /**
   * @description Compile pug template to HTML
   * @param keys
   * @returns {*}
   * @private
   */
  _compile(keys) {
    const template = keys.filename === 'order' ? this.order_template : this.invoice_template;
    const compiled = _pug2.default.compileFile(_path2.default.resolve(template));
    return compiled(keys);
  }

  /**
   * @description Return invoice translation keys object
   * @returns {*}
   */
  getInvoice() {
    const keys = {
      invoice_header_title: _i18n2.default.__({ phrase: 'invoice_header_title', locale: this.lang }),
      invoice_header_subject: _i18n2.default.__({ phrase: 'invoice_header_subject', locale: this.lang }),
      invoice_header_reference: _i18n2.default.__({ phrase: 'invoice_header_reference', locale: this.lang }),
      invoice_header_reference_value: this.getReferenceFromPattern('invoice'),
      invoice_header_date: _i18n2.default.__({ phrase: 'invoice_header_date', locale: this.lang }),
      table_note_content: this.invoice_note,
      note: note => note ? this.invoice_note = note : this.invoice_note,
      filename: 'invoice'
    };
    return Object.assign(keys, {
      toHTML: () => this._toHTML(keys),
      toPDF: () => this._toPDF(keys)
    }, this._preCompileCommonTranslations());
  }

  /**
   * @description Return order translation keys object
   * @returns {*}
   */
  getOrder() {
    const keys = {
      order_header_title: _i18n2.default.__({ phrase: 'order_header_title', locale: this.lang }),
      order_header_subject: _i18n2.default.__({ phrase: 'order_header_subject', locale: this.lang }),
      order_header_reference: _i18n2.default.__({ phrase: 'order_header_reference', locale: this.lang }),
      order_header_reference_value: this.getReferenceFromPattern('order'),
      order_header_date: _i18n2.default.__({ phrase: 'order_header_date', locale: this.lang }),
      table_note_content: this.order_note,
      note: note => note ? this.order_note = note : this.order_note,
      filename: 'order'
    };
    return Object.assign(keys, {
      toHTML: () => this._toHTML(keys),
      toPDF: () => this._toPDF(keys)
    }, this._preCompileCommonTranslations());
  }

  /**
   * @description Return right footer
   * @returns {*}
   */
  getFooter() {
    if (!this.footer) return _i18n2.default.__({ phrase: 'footer', locale: this.lang });

    if (this.lang === 'en') return this.footer.en;else if (this.lang === 'fr') return this.footer.fr;
    throw Error('This lang doesn\'t exist.');
  }

  /**
   * @description Return reference from pattern
   * @param type
   * @return {*}
   */
  getReferenceFromPattern(type) {
    if (!['order', 'invoice'].includes(type)) throw new Error('Type have to be "order" or "invoice"');
    if (this.reference) return this.reference;
    return this.setReferenceFromPattern(type === 'order' ? this.order_reference_pattern : this.invoice_reference_pattern);
  }

  /**
   * @description Set reference
   * @param pattern
   * @return {*}
   * @private
   * @todo optimize it
   */
  setReferenceFromPattern(pattern) {
    const tmp = pattern.split('$').slice(1);
    let output = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const item of tmp) {
      if (!item.endsWith('}')) throw new Error('Wrong pattern type');
      if (item.startsWith('prefix{')) output += item.replace('prefix{', '').slice(0, -1);else if (item.startsWith('separator{')) output += item.replace('separator{', '').slice(0, -1);else if (item.startsWith('date{')) output += (0, _moment2.default)().format(item.replace('date{', '').slice(0, -1));else if (item.startsWith('id{')) {
        const id = item.replace('id{', '').slice(0, -1);
        if (!/^\d+$/.test(id)) throw new Error(`Id must be an integer (${id})`);
        output += this._id ? this.pad(this._id, id.length) : this.pad(0, id.length);
      } else throw new Error(`${item} pattern reference unknown`);
    }
    return output;
  }

  /**
   * @description Export object with html content and exportation functions
   * @returns {{html: *, toFile: (function(*): *)}}
   * @private
   */
  _toHTML(keys) {
    const html = this._compile(keys.filename === 'order' ? this.getOrder() : this.getInvoice());
    return {
      html,
      toFile: filepath => this._toFileFromHTML(html, filepath || `${keys.filename}.html`),
      toBuffer: () => Promise.resolve(Buffer.from(html))
    };
  }

  /**
   * @description Save content to pdf file
   * @returns {*}
   * @private
   */
  _toPDF(keys) {
    const pdf = _htmlPdf2.default.create(this._toHTML(keys).html, { timeout: '90000', format: 'letter' });
    return {
      pdf,
      toFile: filepath => this._toFileFromPDF(pdf, filepath || `${keys.filename}.pdf`),
      toBuffer: () => this._toBufferFromPDF(pdf),
      toStream: filepath => this._toStreamFromPDF(pdf, filepath || `${keys.filename}.pdf`)
    };
  }

  /**
   * @description Save content into file from toHTML() method
   * @param content
   * @param filepath
   * @returns {Promise}
   * @private
   */
  _toFileFromHTML(content, filepath) {
    return new Promise((resolve, reject) => _fs2.default.writeFile(filepath, content, err => {
      if (err) reject(err);
      return resolve();
    }));
  }

  /**
   * @description Save content into file from toPDF() method
   * @param content
   * @param filepath
   * @returns {Promise}
   * @private
   */
  _toFileFromPDF(content, filepath) {
    return new Promise((resolve, reject) => content.toFile(filepath, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    }));
  }

  /**
   * @description Export PDF to buffer
   * @param content
   * @returns {*}
   * @private
   */
  _toBufferFromPDF(content) {
    return new Promise((resolve, reject) => content.toBuffer((err, buffer) => {
      if (err) return reject(err);
      return resolve(buffer);
    }));
  }

  /**
   * @description Export PDF to file using stream
   * @param content
   * @param filepath
   * @returns {*}
   * @private
   */
  _toStreamFromPDF(content, filepath) {
    return content.toStream((err, stream) => stream.pipe(_fs2.default.createWriteStream(filepath)));
  }

  /**
   * @description Calculates number of pages and items per page
   * @return {{rows_in_first_page: number, rows_in_others_pages: number, loop_table: number}}
   * @private
   */
  _templateConfiguration() {
    const template_rows_per_page = 29;
    const templateConfig = {
      rows_in_first_page: this.article.length > 19 ? template_rows_per_page : 19,
      rows_per_pages: 43,
      rows_in_last_page: 33
    };

    let nbArticles = this.article.length;
    let loop = 1;
    while (true) {
      if (loop === 1) {
        nbArticles -= templateConfig.rows_in_first_page;
        if (nbArticles <= 0) {
          templateConfig.loop_table = templateConfig.rows_in_first_page !== template_rows_per_page ? 1 : 2;
          return templateConfig;
        }
      }

      if (loop >= 2) {
        if (nbArticles <= templateConfig.rows_in_last_page) {
          templateConfig.loop_table = loop;
          return templateConfig;
        }
        nbArticles -= templateConfig.rows_per_pages;
        if (nbArticles <= 0) {
          templateConfig.loop_table = loop;
          return templateConfig;
        }
      }
      loop += 1;
    }
  }

  /**
   * @description Overrides i18n configuration
   * @param config
   * @private
   */
  _i18nConfigure(config) {
    this._defaultLocale = config && config.defaultLocale ? config.defaultLocale : 'en';
    this._availableLocale = config && config.locales ? config.locales : ['en', 'fr'];
    if (config) _i18n2.default.configure(config);
  }
}
exports.default = Generator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzc2VzL2dlbmVyYXRvci5qcyJdLCJuYW1lcyI6WyJHZW5lcmF0b3IiLCJjb25zdHJ1Y3RvciIsImNvbmZpZyIsIl9yZWNpcGllbnQiLCJyZWNpcGllbnQiLCJfZW1pdHRlciIsImVtaXR0ZXIiLCJfdG90YWxfZXhjX3RheGVzIiwiX3RvdGFsX3RheGVzIiwiX3RvdGFsX2luY190YXhlcyIsIl9hcnRpY2xlIiwiX2kxOG5Db25maWd1cmUiLCJsYW5ndWFnZSIsImh5ZHJhdGUiLCJnbG9iYWwiLCJfaXRlbXNUb0h5ZHJhdGUiLCJ0ZW1wbGF0ZSIsIl90ZW1wbGF0ZSIsInZhbHVlIiwibGFuZyIsIl9sYW5nIiwiX2RlZmF1bHRMb2NhbGUiLCJ0bXAiLCJ0b0xvd2VyQ2FzZSIsIl9hdmFpbGFibGVMb2NhbGUiLCJpbmNsdWRlcyIsIkVycm9yIiwiam9pbiIsImlkIiwiX2lkIiwib3JkZXJfcmVmZXJlbmNlX3BhdHRlcm4iLCJfb3JkZXJfcmVmZXJlbmNlX3BhdHRlcm4iLCJpbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuIiwiX2ludm9pY2VfcmVmZXJlbmNlX3BhdHRlcm4iLCJyZWZlcmVuY2UiLCJfcmVmZXJlbmNlIiwibG9nbyIsIl9sb2dvIiwib3JkZXJfdGVtcGxhdGUiLCJfb3JkZXJfdGVtcGxhdGUiLCJpbnZvaWNlX3RlbXBsYXRlIiwiX2ludm9pY2VfdGVtcGxhdGUiLCJvcmRlcl9ub3RlIiwiX29yZGVyX25vdGUiLCJpbnZvaWNlX25vdGUiLCJfaW52b2ljZV9ub3RlIiwiZm9vdGVyIiwiX2Zvb3RlciIsImRhdGVfZm9ybWF0IiwiX2RhdGVfZm9ybWF0IiwiZGF0ZSIsIl9kYXRlIiwiZm9ybWF0IiwiaXNWYWxpZCIsInRvdGFsX2V4Y190YXhlcyIsInRvdGFsX3RheGVzIiwidG90YWxfaW5jX3RheGVzIiwiYXJ0aWNsZSIsIkFycmF5IiwiaXNBcnJheSIsImkiLCJsZW5ndGgiLCJfY2hlY2tBcnRpY2xlIiwidG90YWxfcHJvZHVjdF93aXRob3V0X3RheGVzIiwiZm9ybWF0T3V0cHV0TnVtYmVyIiwicHJpY2UiLCJxdCIsInRvdGFsX3Byb2R1Y3RfdGF4ZXMiLCJyb3VuZCIsInRheCIsInRvdGFsX3Byb2R1Y3Rfd2l0aF90YXhlcyIsIk51bWJlciIsImNvbmNhdCIsImRlbGV0ZUFydGljbGVzIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaXNOdW1lcmljIiwiaXNJbnRlZ2VyIiwib2JqIiwiX3ByZUNvbXBpbGVDb21tb25UcmFuc2xhdGlvbnMiLCJoZWFkZXJfZGF0ZSIsInRhYmxlX2luZm9ybWF0aW9uIiwiX18iLCJwaHJhc2UiLCJsb2NhbGUiLCJ0YWJsZV9kZXNjcmlwdGlvbiIsInRhYmxlX3RheCIsInRhYmxlX3F1YW50aXR5IiwidGFibGVfcHJpY2Vfd2l0aG91dF90YXhlcyIsInRhYmxlX3ByaWNlX3dpdGhvdXRfdGF4ZXNfdW5pdCIsInRhYmxlX25vdGUiLCJ0YWJsZV90b3RhbF93aXRob3V0X3RheGVzIiwidGFibGVfdG90YWxfdGF4ZXMiLCJ0YWJsZV90b3RhbF93aXRoX3RheGVzIiwiZnJvbXRvX3Bob25lIiwiZnJvbXRvX21haWwiLCJnZXRGb290ZXIiLCJlbWl0dGVyX25hbWUiLCJuYW1lIiwiZW1pdHRlcl9zdHJlZXRfbnVtYmVyIiwic3RyZWV0X251bWJlciIsImVtaXR0ZXJfc3RyZWV0X25hbWUiLCJzdHJlZXRfbmFtZSIsImVtaXR0ZXJfemlwX2NvZGUiLCJ6aXBfY29kZSIsImVtaXR0ZXJfY2l0eSIsImNpdHkiLCJlbWl0dGVyX2NvdW50cnkiLCJjb3VudHJ5IiwiZW1pdHRlcl9waG9uZSIsInBob25lIiwiZW1pdHRlcl9tYWlsIiwibWFpbCIsInJlY2lwaWVudF9jb21wYW55IiwiY29tcGFueV9uYW1lIiwicmVjaXBpZW50X2ZpcnN0X25hbWUiLCJmaXJzdF9uYW1lIiwicmVjaXBpZW50X2xhc3RfbmFtZSIsImxhc3RfbmFtZSIsInJlY2lwaWVudF9zdHJlZXRfbnVtYmVyIiwicmVjaXBpZW50X3N0cmVldF9uYW1lIiwicmVjaXBpZW50X3ppcF9jb2RlIiwicmVjaXBpZW50X2NpdHkiLCJyZWNpcGllbnRfY291bnRyeSIsInJlY2lwaWVudF9waG9uZSIsInJlY2lwaWVudF9tYWlsIiwiYXJ0aWNsZXMiLCJ0YWJsZV90b3RhbF93aXRob3V0X3RheGVzX3ZhbHVlIiwidGFibGVfdG90YWxfdGF4ZXNfdmFsdWUiLCJ0YWJsZV90b3RhbF93aXRoX3RheGVzX3ZhbHVlIiwidGVtcGxhdGVfY29uZmlndXJhdGlvbiIsIl90ZW1wbGF0ZUNvbmZpZ3VyYXRpb24iLCJtb21lbnQiLCJfY29tcGlsZSIsImtleXMiLCJmaWxlbmFtZSIsImNvbXBpbGVkIiwiY29tcGlsZUZpbGUiLCJyZXNvbHZlIiwiZ2V0SW52b2ljZSIsImludm9pY2VfaGVhZGVyX3RpdGxlIiwiaW52b2ljZV9oZWFkZXJfc3ViamVjdCIsImludm9pY2VfaGVhZGVyX3JlZmVyZW5jZSIsImludm9pY2VfaGVhZGVyX3JlZmVyZW5jZV92YWx1ZSIsImdldFJlZmVyZW5jZUZyb21QYXR0ZXJuIiwiaW52b2ljZV9oZWFkZXJfZGF0ZSIsInRhYmxlX25vdGVfY29udGVudCIsIm5vdGUiLCJhc3NpZ24iLCJ0b0hUTUwiLCJfdG9IVE1MIiwidG9QREYiLCJfdG9QREYiLCJnZXRPcmRlciIsIm9yZGVyX2hlYWRlcl90aXRsZSIsIm9yZGVyX2hlYWRlcl9zdWJqZWN0Iiwib3JkZXJfaGVhZGVyX3JlZmVyZW5jZSIsIm9yZGVyX2hlYWRlcl9yZWZlcmVuY2VfdmFsdWUiLCJvcmRlcl9oZWFkZXJfZGF0ZSIsImVuIiwiZnIiLCJ0eXBlIiwic2V0UmVmZXJlbmNlRnJvbVBhdHRlcm4iLCJwYXR0ZXJuIiwic3BsaXQiLCJzbGljZSIsIm91dHB1dCIsIml0ZW0iLCJlbmRzV2l0aCIsInN0YXJ0c1dpdGgiLCJyZXBsYWNlIiwidGVzdCIsInBhZCIsImh0bWwiLCJ0b0ZpbGUiLCJmaWxlcGF0aCIsIl90b0ZpbGVGcm9tSFRNTCIsInRvQnVmZmVyIiwiUHJvbWlzZSIsIkJ1ZmZlciIsImZyb20iLCJwZGYiLCJjcmVhdGUiLCJ0aW1lb3V0IiwiX3RvRmlsZUZyb21QREYiLCJfdG9CdWZmZXJGcm9tUERGIiwidG9TdHJlYW0iLCJfdG9TdHJlYW1Gcm9tUERGIiwiY29udGVudCIsInJlamVjdCIsIndyaXRlRmlsZSIsImVyciIsInJlcyIsImJ1ZmZlciIsInN0cmVhbSIsInBpcGUiLCJjcmVhdGVXcml0ZVN0cmVhbSIsInRlbXBsYXRlX3Jvd3NfcGVyX3BhZ2UiLCJ0ZW1wbGF0ZUNvbmZpZyIsInJvd3NfaW5fZmlyc3RfcGFnZSIsInJvd3NfcGVyX3BhZ2VzIiwicm93c19pbl9sYXN0X3BhZ2UiLCJuYkFydGljbGVzIiwibG9vcCIsImxvb3BfdGFibGUiLCJkZWZhdWx0TG9jYWxlIiwibG9jYWxlcyIsImNvbmZpZ3VyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxTQUFOLDBCQUErQjtBQUM1Q0MsY0FBWUMsTUFBWixFQUFvQjtBQUNsQjtBQUNBLFNBQUtDLFVBQUwsR0FBbUJELE9BQU9FLFNBQVIsR0FBcUIsd0JBQWNGLE9BQU9FLFNBQXJCLENBQXJCLEdBQXVELHlCQUF6RTtBQUNBLFNBQUtDLFFBQUwsR0FBaUJILE9BQU9JLE9BQVIsR0FBbUIsc0JBQVlKLE9BQU9JLE9BQW5CLENBQW5CLEdBQWlELHVCQUFqRTtBQUNBLFNBQUtDLGdCQUFMLEdBQXdCLENBQXhCO0FBQ0EsU0FBS0MsWUFBTCxHQUFvQixDQUFwQjtBQUNBLFNBQUtDLGdCQUFMLEdBQXdCLENBQXhCO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUNBLFNBQUtDLGNBQUwsQ0FBb0JULE9BQU9VLFFBQTNCO0FBQ0EsU0FBS0MsT0FBTCxDQUFhWCxPQUFPWSxNQUFwQixFQUE0QixLQUFLQyxlQUFMLEVBQTVCO0FBQ0Q7O0FB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LHlCQUFlTSxVQUFmLEdBQTZCTixlQUFlQyxrQkFBZixLQUFzQ0Ysc0JBQXZDLEdBQWlFLENBQWpFLEdBQXFFLENBQWpHO0FBQ0EsaUJBQU9DLGNBQVA7QUFDRDtBQUNGOztBQUVELFVBQUlLLFFBQVEsQ0FBWixFQUFlO0FBQ2IsWUFBSUQsY0FBY0osZUFBZUcsaUJBQWpDLEVBQW9EO0FBQ2xESCx5QkFBZU0sVUFBZixHQUE0QkQsSUFBNUI7QUFDQSxpQkFBT0wsY0FBUDtBQUNEO0FBQ0RJLHNCQUFjSixlQUFlRSxjQUE3QjtBQUNBLFlBQUlFLGNBQWMsQ0FBbEIsRUFBcUI7QUFDbkJKLHlCQUFlTSxVQUFmLEdBQTRCRCxJQUE1QjtBQUNBLGlCQUFPTCxjQUFQO0FBQ0Q7QUFDRjtBQUNESyxjQUFRLENBQVI7QUFDRDtBQUNGOztBQUVEOzs7OztBQUtBbE0saUJBQWVULE1BQWYsRUFBdUI7QUFDckIsU0FBS21CLGNBQUwsR0FBdUJuQixVQUFVQSxPQUFPNk0sYUFBbEIsR0FBbUM3TSxPQUFPNk0sYUFBMUMsR0FBMEQsSUFBaEY7QUFDQSxTQUFLdkwsZ0JBQUwsR0FBeUJ0QixVQUFVQSxPQUFPOE0sT0FBbEIsR0FBNkI5TSxPQUFPOE0sT0FBcEMsR0FBOEMsQ0FBQyxJQUFELEVBQU8sSUFBUCxDQUF0RTtBQUNBLFFBQUk5TSxNQUFKLEVBQVksZUFBSytNLFNBQUwsQ0FBZS9NLE1BQWY7QUFDYjtBQWpoQjJDO2tCQUF6QkYsUyIsImZpbGUiOiJnZW5lcmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgcHVnIGZyb20gJ3B1Zyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgaHRtbFRvUGRmIGZyb20gJ2h0bWwtcGRmJztcbmltcG9ydCBDb21tb24gZnJvbSAnLi9jb21tb24nO1xuaW1wb3J0IFJlY2lwaWVudCBmcm9tICcuL3JlY2lwaWVudCc7XG5pbXBvcnQgRW1pdHRlciBmcm9tICcuL2VtaXR0ZXInO1xuaW1wb3J0IGkxOG4gZnJvbSAnLi4vbGliL2kxOG4nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5lcmF0b3IgZXh0ZW5kcyBDb21tb24ge1xuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3JlY2lwaWVudCA9IChjb25maWcucmVjaXBpZW50KSA/IG5ldyBSZWNpcGllbnQoY29uZmlnLnJlY2lwaWVudCkgOiBuZXcgUmVjaXBpZW50KCk7XG4gICAgdGhpcy5fZW1pdHRlciA9IChjb25maWcuZW1pdHRlcikgPyBuZXcgRW1pdHRlcihjb25maWcuZW1pdHRlcikgOiBuZXcgRW1pdHRlcigpO1xuICAgIHRoaXMuX3RvdGFsX2V4Y190YXhlcyA9IDA7XG4gICAgdGhpcy5fdG90YWxfdGF4ZXMgPSAwO1xuICAgIHRoaXMuX3RvdGFsX2luY190YXhlcyA9IDA7XG4gICAgdGhpcy5fYXJ0aWNsZSA9IFtdO1xuICAgIHRoaXMuX2kxOG5Db25maWd1cmUoY29uZmlnLmxhbmd1YWdlKTtcbiAgICB0aGlzLmh5ZHJhdGUoY29uZmlnLmdsb2JhbCwgdGhpcy5faXRlbXNUb0h5ZHJhdGUoKSk7XG4gIH1cblxuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlO1xuICB9XG5cbiAgc2V0IHRlbXBsYXRlKHZhbHVlKSB7XG4gICAgdGhpcy5fdGVtcGxhdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBsYW5nKCkge1xuICAgIHJldHVybiAoIXRoaXMuX2xhbmcpID8gdGhpcy5fZGVmYXVsdExvY2FsZSA6IHRoaXMuX2xhbmc7XG4gIH1cblxuICBzZXQgbGFuZyh2YWx1ZSkge1xuICAgIGNvbnN0IHRtcCA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKCF0aGlzLl9hdmFpbGFibGVMb2NhbGUuaW5jbHVkZXModG1wKSkgdGhyb3cgbmV3IEVycm9yKGBXcm9uZyBsYW5nLCBwbGVhc2Ugc2V0IG9uZSBvZiAke3RoaXMuX2F2YWlsYWJsZUxvY2FsZS5qb2luKCcsICcpfWApO1xuICAgIHRoaXMuX2xhbmcgPSB0bXA7XG4gIH1cblxuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG5cbiAgc2V0IGlkKHZhbHVlKSB7XG4gICAgdGhpcy5faWQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBvcmRlcl9yZWZlcmVuY2VfcGF0dGVybigpIHtcbiAgICByZXR1cm4gKCF0aGlzLl9vcmRlcl9yZWZlcmVuY2VfcGF0dGVybikgPyAnJHByZWZpeHtPUn0kZGF0ZXtZWU1NfSRzZXBhcmF0b3J7LX0kaWR7MDAwMDB9JyA6IHRoaXMuX29yZGVyX3JlZmVyZW5jZV9wYXR0ZXJuO1xuICB9XG5cbiAgc2V0IG9yZGVyX3JlZmVyZW5jZV9wYXR0ZXJuKHZhbHVlKSB7XG4gICAgdGhpcy5fb3JkZXJfcmVmZXJlbmNlX3BhdHRlcm4gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBpbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuKCkge1xuICAgIHJldHVybiAoIXRoaXMuX2ludm9pY2VfcmVmZXJlbmNlX3BhdHRlcm4pID8gJyRwcmVmaXh7SU59JGRhdGV7WVlNTX0kc2VwYXJhdG9yey19JGlkezAwMDAwfScgOiB0aGlzLl9pbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuO1xuICB9XG5cbiAgc2V0IGludm9pY2VfcmVmZXJlbmNlX3BhdHRlcm4odmFsdWUpIHtcbiAgICB0aGlzLl9pbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcmVmZXJlbmNlKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWZlcmVuY2U7XG4gIH1cblxuICBzZXQgcmVmZXJlbmNlKHZhbHVlKSB7XG4gICAgdGhpcy5fcmVmZXJlbmNlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgbG9nbygpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9nbztcbiAgfVxuXG4gIHNldCBsb2dvKHZhbHVlKSB7XG4gICAgdGhpcy5fbG9nbyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG9yZGVyX3RlbXBsYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9vcmRlcl90ZW1wbGF0ZTtcbiAgfVxuXG4gIHNldCBvcmRlcl90ZW1wbGF0ZSh2YWx1ZSkge1xuICAgIHRoaXMuX29yZGVyX3RlbXBsYXRlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgaW52b2ljZV90ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faW52b2ljZV90ZW1wbGF0ZTtcbiAgfVxuXG4gIHNldCBpbnZvaWNlX3RlbXBsYXRlKHZhbHVlKSB7XG4gICAgdGhpcy5faW52b2ljZV90ZW1wbGF0ZSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG9yZGVyX25vdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yZGVyX25vdGU7XG4gIH1cblxuICBzZXQgb3JkZXJfbm90ZSh2YWx1ZSkge1xuICAgIHRoaXMuX29yZGVyX25vdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBpbnZvaWNlX25vdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ludm9pY2Vfbm90ZTtcbiAgfVxuXG4gIHNldCBpbnZvaWNlX25vdGUodmFsdWUpIHtcbiAgICB0aGlzLl9pbnZvaWNlX25vdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBmb290ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvb3RlcjtcbiAgfVxuXG4gIHNldCBmb290ZXIodmFsdWUpIHtcbiAgICB0aGlzLl9mb290ZXIgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBkYXRlX2Zvcm1hdCgpIHtcbiAgICByZXR1cm4gKCF0aGlzLl9kYXRlX2Zvcm1hdCkgPyAnWVlZWS9NTS9ERCcgOiB0aGlzLl9kYXRlX2Zvcm1hdDtcbiAgfVxuXG4gIHNldCBkYXRlX2Zvcm1hdCh2YWx1ZSkge1xuICAgIHRoaXMuX2RhdGVfZm9ybWF0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZGF0ZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLl9kYXRlKSA/IG1vbWVudCgpLmZvcm1hdCh0aGlzLmRhdGVfZm9ybWF0KSA6IHRoaXMuX2RhdGU7XG4gIH1cblxuICBzZXQgZGF0ZSh2YWx1ZSkge1xuICAgIGlmICghbW9tZW50KHZhbHVlKS5pc1ZhbGlkKCkpIHRocm93IG5ldyBFcnJvcignRGF0ZSBub3QgdmFsaWQnKTtcbiAgICB0aGlzLl9kYXRlID0gbW9tZW50KHZhbHVlKS5mb3JtYXQodGhpcy5kYXRlX2Zvcm1hdCk7XG4gIH1cblxuICBnZXQgdG90YWxfZXhjX3RheGVzKCkge1xuICAgIHJldHVybiB0aGlzLl90b3RhbF9leGNfdGF4ZXM7XG4gIH1cblxuICBzZXQgdG90YWxfZXhjX3RheGVzKHZhbHVlKSB7XG4gICAgdGhpcy5fdG90YWxfZXhjX3RheGVzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgdG90YWxfdGF4ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RvdGFsX3RheGVzO1xuICB9XG5cbiAgc2V0IHRvdGFsX3RheGVzKHZhbHVlKSB7XG4gICAgdGhpcy5fdG90YWxfdGF4ZXMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCB0b3RhbF9pbmNfdGF4ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RvdGFsX2luY190YXhlcztcbiAgfVxuXG4gIHNldCB0b3RhbF9pbmNfdGF4ZXModmFsdWUpIHtcbiAgICB0aGlzLl90b3RhbF9pbmNfdGF4ZXMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBhcnRpY2xlKCkge1xuICAgIHJldHVybiB0aGlzLl9hcnRpY2xlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBTZXRcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqIEBleGFtcGxlIGFydGljbGUoe2Rlc2NyaXB0aW9uOiAnTGljZW5jZScsIHRheDogMjAsIHByaWNlOiAxMDAsIHF0OiAxfSlcbiAgICogQGV4YW1wbGUgYXJ0aWNsZShbXG4gICAqICB7ZGVzY3JpcHRpb246ICdMaWNlbmNlJywgdGF4OiAyMCwgcHJpY2U6IDEwMCwgcXQ6IDF9LFxuICAgKiAge2Rlc2NyaXB0aW9uOiAnTGljZW5jZScsIHRheDogMjAsIHByaWNlOiAxMDAsIHF0OiAxfVxuICAgKiBdKVxuICAgKi9cbiAgc2V0IGFydGljbGUodmFsdWUpIHtcbiAgICBjb25zdCB0bXAgPSB2YWx1ZTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0bXApKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB0aGlzLl9jaGVja0FydGljbGUodG1wW2ldKTtcbiAgICAgICAgdG1wW2ldLnRvdGFsX3Byb2R1Y3Rfd2l0aG91dF90YXhlcyA9IHRoaXMuZm9ybWF0T3V0cHV0TnVtYmVyKHRtcFtpXS5wcmljZSAqIHRtcFtpXS5xdCk7XG4gICAgICAgIHRtcFtpXS50b3RhbF9wcm9kdWN0X3RheGVzID0gdGhpcy5mb3JtYXRPdXRwdXROdW1iZXIodGhpcy5yb3VuZCh0bXBbaV0udG90YWxfcHJvZHVjdF93aXRob3V0X3RheGVzICogKHRtcFtpXS50YXggLyAxMDApKSk7XG4gICAgICAgIHRtcFtpXS50b3RhbF9wcm9kdWN0X3dpdGhfdGF4ZXMgPSB0aGlzLmZvcm1hdE91dHB1dE51bWJlcih0aGlzLnJvdW5kKE51bWJlcih0bXBbaV0udG90YWxfcHJvZHVjdF93aXRob3V0X3RheGVzKSArIE51bWJlcih0bXBbaV0udG90YWxfcHJvZHVjdF90YXhlcykpKTtcbiAgICAgICAgdG1wW2ldLnByaWNlID0gdGhpcy5mb3JtYXRPdXRwdXROdW1iZXIodG1wW2ldLnByaWNlKTtcbiAgICAgICAgdG1wW2ldLnRheCA9IHRoaXMuZm9ybWF0T3V0cHV0TnVtYmVyKHRtcFtpXS50YXgpO1xuICAgICAgICB0aGlzLnRvdGFsX2V4Y190YXhlcyArPSBOdW1iZXIodG1wW2ldLnRvdGFsX3Byb2R1Y3Rfd2l0aG91dF90YXhlcyk7XG4gICAgICAgIHRoaXMudG90YWxfaW5jX3RheGVzICs9IE51bWJlcih0bXBbaV0udG90YWxfcHJvZHVjdF93aXRoX3RheGVzKTtcbiAgICAgICAgdGhpcy50b3RhbF90YXhlcyArPSBOdW1iZXIodG1wW2ldLnRvdGFsX3Byb2R1Y3RfdGF4ZXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jaGVja0FydGljbGUodG1wKTtcbiAgICAgIHRtcC50b3RhbF9wcm9kdWN0X3dpdGhvdXRfdGF4ZXMgPSB0aGlzLmZvcm1hdE91dHB1dE51bWJlcih0bXAucHJpY2UgKiB0bXAucXQpO1xuICAgICAgdG1wLnRvdGFsX3Byb2R1Y3RfdGF4ZXMgPSB0aGlzLmZvcm1hdE91dHB1dE51bWJlcih0aGlzLnJvdW5kKHRtcC50b3RhbF9wcm9kdWN0X3dpdGhvdXRfdGF4ZXMgKiAodG1wLnRheCAvIDEwMCkpKTtcbiAgICAgIHRtcC50b3RhbF9wcm9kdWN0X3dpdGhfdGF4ZXMgPSB0aGlzLmZvcm1hdE91dHB1dE51bWJlcih0aGlzLnJvdW5kKE51bWJlcih0bXAudG90YWxfcHJvZHVjdF93aXRob3V0X3RheGVzKSArIE51bWJlcih0bXAudG90YWxfcHJvZHVjdF90YXhlcykpKTtcbiAgICAgIHRtcC5wcmljZSA9IHRoaXMuZm9ybWF0T3V0cHV0TnVtYmVyKHRtcC5wcmljZSk7XG4gICAgICB0bXAudGF4ID0gdGhpcy5mb3JtYXRPdXRwdXROdW1iZXIodG1wLnRheCk7XG4gICAgICB0aGlzLnRvdGFsX2V4Y190YXhlcyArPSBOdW1iZXIodG1wLnRvdGFsX3Byb2R1Y3Rfd2l0aG91dF90YXhlcyk7XG4gICAgICB0aGlzLnRvdGFsX2luY190YXhlcyArPSBOdW1iZXIodG1wLnRvdGFsX3Byb2R1Y3Rfd2l0aF90YXhlcyk7XG4gICAgICB0aGlzLnRvdGFsX3RheGVzICs9IE51bWJlcih0bXAudG90YWxfcHJvZHVjdF90YXhlcyk7XG4gICAgfVxuICAgIHRoaXMuX2FydGljbGUgPSAodGhpcy5fYXJ0aWNsZSkgPyB0aGlzLl9hcnRpY2xlLmNvbmNhdCh0bXApIDogW10uY29uY2F0KHRtcCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFJlaW5pdGlhbGl6ZSBhcnRpY2xlIGF0dHJpYnV0ZVxuICAgKi9cbiAgZGVsZXRlQXJ0aWNsZXMoKSB7XG4gICAgdGhpcy5fdG90YWxfaW5jX3RheGVzID0gMDtcbiAgICB0aGlzLl90b3RhbF90YXhlcyA9IDA7XG4gICAgdGhpcy5fdG90YWxfZXhjX3RheGVzID0gMDtcbiAgICB0aGlzLl9hcnRpY2xlID0gW107XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIENoZWNrIGFydGljbGUgc3RydWN0dXJlIGFuZCBkYXRhXG4gICAqIEBwYXJhbSBhcnRpY2xlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2hlY2tBcnRpY2xlKGFydGljbGUpIHtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcnRpY2xlLCAnZGVzY3JpcHRpb24nKSkgdGhyb3cgbmV3IEVycm9yKCdEZXNjcmlwdGlvbiBhdHRyaWJ1dGUgaXMgbWlzc2luZycpO1xuICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFydGljbGUsICd0YXgnKSkgdGhyb3cgbmV3IEVycm9yKCdUYXggYXR0cmlidXRlIGlzIG1pc3NpbmcnKTtcbiAgICBpZiAoIXRoaXMuaXNOdW1lcmljKGFydGljbGUudGF4KSkgdGhyb3cgbmV3IEVycm9yKCdUYXggYXR0cmlidXRlIGhhdmUgdG8gYmUgYSBudW1iZXInKTtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcnRpY2xlLCAncHJpY2UnKSkgdGhyb3cgbmV3IEVycm9yKCdQcmljZSBhdHRyaWJ1dGUgaXMgbWlzc2luZycpO1xuICAgIGlmICghdGhpcy5pc051bWVyaWMoYXJ0aWNsZS5wcmljZSkpIHRocm93IG5ldyBFcnJvcignUHJpY2UgYXR0cmlidXRlIGhhdmUgdG8gYmUgYSBudW1iZXInKTtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcnRpY2xlLCAncXQnKSkgdGhyb3cgbmV3IEVycm9yKCdRdCBhdHRyaWJ1dGUgaXMgbWlzc2luZycpO1xuICAgIGlmICghdGhpcy5pc051bWVyaWMoYXJ0aWNsZS5xdCkpIHRocm93IG5ldyBFcnJvcignUXQgYXR0cmlidXRlIGhhdmUgdG8gYmUgYW4gaW50ZWdlcicpO1xuICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihhcnRpY2xlLnF0KSkgdGhyb3cgbmV3IEVycm9yKCdRdCBhdHRyaWJ1dGUgaGF2ZSB0byBiZSBhbiBpbnRlZ2VyLCBub3QgYSBmbG9hdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBIeWRyYXRlIGZyb20gY29uZmlndXJhdGlvblxuICAgKiBAcmV0dXJucyB7W3N0cmluZyxzdHJpbmcsc3RyaW5nLHN0cmluZ119XG4gICAqL1xuICBfaXRlbXNUb0h5ZHJhdGUoKSB7XG4gICAgcmV0dXJuIFsnbG9nbycsICdvcmRlcl90ZW1wbGF0ZScsICdpbnZvaWNlX3RlbXBsYXRlJywgJ2RhdGVfZm9ybWF0JywgJ29yZGVyX3JlZmVyZW5jZV9wYXR0ZXJuJywgJ2ludm9pY2VfcmVmZXJlbmNlX3BhdHRlcm4nLCAnb3JkZXJfbm90ZScsICdpbnZvaWNlX25vdGUnLCAnbGFuZycsICdmb290ZXInXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gSHlkcmF0ZSByZWNpcGllbnQgb2JqZWN0XG4gICAqIEBwYXJhbSBvYmpcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICByZWNpcGllbnQob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiB0aGlzLl9yZWNpcGllbnQ7XG4gICAgcmV0dXJuIHRoaXMuX3JlY2lwaWVudC5oeWRyYXRlKG9iaiwgdGhpcy5fcmVjaXBpZW50Ll9pdGVtc1RvSHlkcmF0ZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gSHlkcmF0ZSBlbWl0dGVyIG9iamVjdFxuICAgKiBAcGFyYW0gb2JqXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgZW1pdHRlcihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIHRoaXMuX2VtaXR0ZXI7XG4gICAgcmV0dXJuIHRoaXMuX2VtaXR0ZXIuaHlkcmF0ZShvYmosIHRoaXMuX2VtaXR0ZXIuX2l0ZW1zVG9IeWRyYXRlKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBQcmVjb21waWxlIHRyYW5zbGF0aW9uIHRvIG1lcmdpbmcgZ2xhYmFsIHdpdGggY3VzdG9tIHRyYW5zbGF0aW9uc1xuICAgKiBAcmV0dXJucyB7e2xvZ286ICosIGhlYWRlcl9kYXRlOiAqLCB0YWJsZV9pbmZvcm1hdGlvbiwgdGFibGVfZGVzY3JpcHRpb24sIHRhYmxlX3RheCwgdGFibGVfcXVhbnRpdHksXG4gICAqIHRhYmxlX3ByaWNlX3dpdGhvdXRfdGF4ZXMsIHRhYmxlX3ByaWNlX3dpdGhvdXRfdGF4ZXNfdW5pdCwgdGFibGVfbm90ZSwgdGFibGVfdG90YWxfd2l0aG91dF90YXhlcyxcbiAgICogdGFibGVfdG90YWxfdGF4ZXMsIHRhYmxlX3RvdGFsX3dpdGhfdGF4ZXMsIGZyb210b19waG9uZSwgZnJvbXRvX21haWwsIGZvb3RlciwgbW9tZW50OiAoKnxtb21lbnQuTW9tZW50KX19XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcHJlQ29tcGlsZUNvbW1vblRyYW5zbGF0aW9ucygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbG9nbzogdGhpcy5sb2dvLFxuICAgICAgaGVhZGVyX2RhdGU6IHRoaXMuZGF0ZSxcbiAgICAgIHRhYmxlX2luZm9ybWF0aW9uOiBpMThuLl9fKHtwaHJhc2U6ICd0YWJsZV9pbmZvcm1hdGlvbicsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICB0YWJsZV9kZXNjcmlwdGlvbjogaTE4bi5fXyh7cGhyYXNlOiAndGFibGVfZGVzY3JpcHRpb24nLCBsb2NhbGU6IHRoaXMubGFuZ30pLFxuICAgICAgdGFibGVfdGF4OiBpMThuLl9fKHtwaHJhc2U6ICd0YWJsZV90YXgnLCBsb2NhbGU6IHRoaXMubGFuZ30pLFxuICAgICAgdGFibGVfcXVhbnRpdHk6IGkxOG4uX18oe3BocmFzZTogJ3RhYmxlX3F1YW50aXR5JywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIHRhYmxlX3ByaWNlX3dpdGhvdXRfdGF4ZXM6IGkxOG4uX18oe3BocmFzZTogJ3RhYmxlX3ByaWNlX3dpdGhvdXRfdGF4ZXMnLCBsb2NhbGU6IHRoaXMubGFuZ30pLFxuICAgICAgdGFibGVfcHJpY2Vfd2l0aG91dF90YXhlc191bml0OiBpMThuLl9fKHtwaHJhc2U6ICd0YWJsZV9wcmljZV93aXRob3V0X3RheGVzX3VuaXQnLCBsb2NhbGU6IHRoaXMubGFuZ30pLFxuICAgICAgdGFibGVfbm90ZTogaTE4bi5fXyh7cGhyYXNlOiAndGFibGVfbm90ZScsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICB0YWJsZV90b3RhbF93aXRob3V0X3RheGVzOiBpMThuLl9fKHtwaHJhc2U6ICd0YWJsZV90b3RhbF93aXRob3V0X3RheGVzJywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIHRhYmxlX3RvdGFsX3RheGVzOiBpMThuLl9fKHtwaHJhc2U6ICd0YWJsZV90b3RhbF90YXhlcycsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICB0YWJsZV90b3RhbF93aXRoX3RheGVzOiBpMThuLl9fKHtwaHJhc2U6ICd0YWJsZV90b3RhbF93aXRoX3RheGVzJywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIGZyb210b19waG9uZTogaTE4bi5fXyh7cGhyYXNlOiAnZnJvbXRvX3Bob25lJywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIGZyb210b19tYWlsOiBpMThuLl9fKHtwaHJhc2U6ICdmcm9tdG9fbWFpbCcsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICBmb290ZXI6IHRoaXMuZ2V0Rm9vdGVyKCksXG4gICAgICBlbWl0dGVyX25hbWU6IHRoaXMuZW1pdHRlcigpLm5hbWUsXG4gICAgICBlbWl0dGVyX3N0cmVldF9udW1iZXI6IHRoaXMuZW1pdHRlcigpLnN0cmVldF9udW1iZXIsXG4gICAgICBlbWl0dGVyX3N0cmVldF9uYW1lOiB0aGlzLmVtaXR0ZXIoKS5zdHJlZXRfbmFtZSxcbiAgICAgIGVtaXR0ZXJfemlwX2NvZGU6IHRoaXMuZW1pdHRlcigpLnppcF9jb2RlLFxuICAgICAgZW1pdHRlcl9jaXR5OiB0aGlzLmVtaXR0ZXIoKS5jaXR5LFxuICAgICAgZW1pdHRlcl9jb3VudHJ5OiB0aGlzLmVtaXR0ZXIoKS5jb3VudHJ5LFxuICAgICAgZW1pdHRlcl9waG9uZTogdGhpcy5lbWl0dGVyKCkucGhvbmUsXG4gICAgICBlbWl0dGVyX21haWw6IHRoaXMuZW1pdHRlcigpLm1haWwsXG4gICAgICByZWNpcGllbnRfY29tcGFueTogdGhpcy5yZWNpcGllbnQoKS5jb21wYW55X25hbWUsXG4gICAgICByZWNpcGllbnRfZmlyc3RfbmFtZTogdGhpcy5yZWNpcGllbnQoKS5maXJzdF9uYW1lLFxuICAgICAgcmVjaXBpZW50X2xhc3RfbmFtZTogdGhpcy5yZWNpcGllbnQoKS5sYXN0X25hbWUsXG4gICAgICByZWNpcGllbnRfc3RyZWV0X251bWJlcjogdGhpcy5yZWNpcGllbnQoKS5zdHJlZXRfbnVtYmVyLFxuICAgICAgcmVjaXBpZW50X3N0cmVldF9uYW1lOiB0aGlzLnJlY2lwaWVudCgpLnN0cmVldF9uYW1lLFxuICAgICAgcmVjaXBpZW50X3ppcF9jb2RlOiB0aGlzLnJlY2lwaWVudCgpLnppcF9jb2RlLFxuICAgICAgcmVjaXBpZW50X2NpdHk6IHRoaXMucmVjaXBpZW50KCkuY2l0eSxcbiAgICAgIHJlY2lwaWVudF9jb3VudHJ5OiB0aGlzLnJlY2lwaWVudCgpLmNvdW50cnksXG4gICAgICByZWNpcGllbnRfcGhvbmU6IHRoaXMucmVjaXBpZW50KCkucGhvbmUsXG4gICAgICByZWNpcGllbnRfbWFpbDogdGhpcy5yZWNpcGllbnQoKS5tYWlsLFxuICAgICAgYXJ0aWNsZXM6IHRoaXMuYXJ0aWNsZSxcbiAgICAgIHRhYmxlX3RvdGFsX3dpdGhvdXRfdGF4ZXNfdmFsdWU6IHRoaXMuZm9ybWF0T3V0cHV0TnVtYmVyKHRoaXMudG90YWxfZXhjX3RheGVzKSxcbiAgICAgIHRhYmxlX3RvdGFsX3RheGVzX3ZhbHVlOiB0aGlzLmZvcm1hdE91dHB1dE51bWJlcih0aGlzLnRvdGFsX3RheGVzKSxcbiAgICAgIHRhYmxlX3RvdGFsX3dpdGhfdGF4ZXNfdmFsdWU6IHRoaXMuZm9ybWF0T3V0cHV0TnVtYmVyKHRoaXMudG90YWxfaW5jX3RheGVzKSxcbiAgICAgIHRlbXBsYXRlX2NvbmZpZ3VyYXRpb246IHRoaXMuX3RlbXBsYXRlQ29uZmlndXJhdGlvbigpLFxuICAgICAgbW9tZW50OiBtb21lbnQoKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBDb21waWxlIHB1ZyB0ZW1wbGF0ZSB0byBIVE1MXG4gICAqIEBwYXJhbSBrZXlzXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NvbXBpbGUoa2V5cykge1xuICAgIGNvbnN0IHRlbXBsYXRlID0ga2V5cy5maWxlbmFtZSA9PT0gJ29yZGVyJyA/IHRoaXMub3JkZXJfdGVtcGxhdGUgOiB0aGlzLmludm9pY2VfdGVtcGxhdGU7XG4gICAgY29uc3QgY29tcGlsZWQgPSBwdWcuY29tcGlsZUZpbGUocGF0aC5yZXNvbHZlKHRlbXBsYXRlKSk7XG4gICAgcmV0dXJuIGNvbXBpbGVkKGtleXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBSZXR1cm4gaW52b2ljZSB0cmFuc2xhdGlvbiBrZXlzIG9iamVjdFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGdldEludm9pY2UoKSB7XG4gICAgY29uc3Qga2V5cyA9IHtcbiAgICAgIGludm9pY2VfaGVhZGVyX3RpdGxlOiBpMThuLl9fKHtwaHJhc2U6ICdpbnZvaWNlX2hlYWRlcl90aXRsZScsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICBpbnZvaWNlX2hlYWRlcl9zdWJqZWN0OiBpMThuLl9fKHtwaHJhc2U6ICdpbnZvaWNlX2hlYWRlcl9zdWJqZWN0JywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIGludm9pY2VfaGVhZGVyX3JlZmVyZW5jZTogaTE4bi5fXyh7cGhyYXNlOiAnaW52b2ljZV9oZWFkZXJfcmVmZXJlbmNlJywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIGludm9pY2VfaGVhZGVyX3JlZmVyZW5jZV92YWx1ZTogdGhpcy5nZXRSZWZlcmVuY2VGcm9tUGF0dGVybignaW52b2ljZScpLFxuICAgICAgaW52b2ljZV9oZWFkZXJfZGF0ZTogaTE4bi5fXyh7cGhyYXNlOiAnaW52b2ljZV9oZWFkZXJfZGF0ZScsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICB0YWJsZV9ub3RlX2NvbnRlbnQ6IHRoaXMuaW52b2ljZV9ub3RlLFxuICAgICAgbm90ZTogKG5vdGUpID0+ICgobm90ZSkgPyB0aGlzLmludm9pY2Vfbm90ZSA9IG5vdGUgOiB0aGlzLmludm9pY2Vfbm90ZSksXG4gICAgICBmaWxlbmFtZTogJ2ludm9pY2UnLFxuICAgIH07XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oa2V5cywge1xuICAgICAgdG9IVE1MOiAoKSA9PiB0aGlzLl90b0hUTUwoa2V5cyksXG4gICAgICB0b1BERjogKCkgPT4gdGhpcy5fdG9QREYoa2V5cyksXG4gICAgfSwgdGhpcy5fcHJlQ29tcGlsZUNvbW1vblRyYW5zbGF0aW9ucygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gUmV0dXJuIG9yZGVyIHRyYW5zbGF0aW9uIGtleXMgb2JqZWN0XG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgZ2V0T3JkZXIoKSB7XG4gICAgY29uc3Qga2V5cyA9IHtcbiAgICAgIG9yZGVyX2hlYWRlcl90aXRsZTogaTE4bi5fXyh7cGhyYXNlOiAnb3JkZXJfaGVhZGVyX3RpdGxlJywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIG9yZGVyX2hlYWRlcl9zdWJqZWN0OiBpMThuLl9fKHtwaHJhc2U6ICdvcmRlcl9oZWFkZXJfc3ViamVjdCcsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICBvcmRlcl9oZWFkZXJfcmVmZXJlbmNlOiBpMThuLl9fKHtwaHJhc2U6ICdvcmRlcl9oZWFkZXJfcmVmZXJlbmNlJywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIG9yZGVyX2hlYWRlcl9yZWZlcmVuY2VfdmFsdWU6IHRoaXMuZ2V0UmVmZXJlbmNlRnJvbVBhdHRlcm4oJ29yZGVyJyksXG4gICAgICBvcmRlcl9oZWFkZXJfZGF0ZTogaTE4bi5fXyh7cGhyYXNlOiAnb3JkZXJfaGVhZGVyX2RhdGUnLCBsb2NhbGU6IHRoaXMubGFuZ30pLFxuICAgICAgdGFibGVfbm90ZV9jb250ZW50OiB0aGlzLm9yZGVyX25vdGUsXG4gICAgICBub3RlOiAobm90ZSkgPT4gKChub3RlKSA/IHRoaXMub3JkZXJfbm90ZSA9IG5vdGUgOiB0aGlzLm9yZGVyX25vdGUpLFxuICAgICAgZmlsZW5hbWU6ICdvcmRlcicsXG4gICAgfTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihrZXlzLCB7XG4gICAgICB0b0hUTUw6ICgpID0+IHRoaXMuX3RvSFRNTChrZXlzKSxcbiAgICAgIHRvUERGOiAoKSA9PiB0aGlzLl90b1BERihrZXlzKSxcbiAgICB9LCB0aGlzLl9wcmVDb21waWxlQ29tbW9uVHJhbnNsYXRpb25zKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBSZXR1cm4gcmlnaHQgZm9vdGVyXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgZ2V0Rm9vdGVyKCkge1xuICAgIGlmICghdGhpcy5mb290ZXIpIHJldHVybiBpMThuLl9fKHtwaHJhc2U6ICdmb290ZXInLCBsb2NhbGU6IHRoaXMubGFuZ30pO1xuXG4gICAgaWYgKHRoaXMubGFuZyA9PT0gJ2VuJykgcmV0dXJuIHRoaXMuZm9vdGVyLmVuO1xuICAgIGVsc2UgaWYgKHRoaXMubGFuZyA9PT0gJ2ZyJykgcmV0dXJuIHRoaXMuZm9vdGVyLmZyO1xuICAgIHRocm93IEVycm9yKCdUaGlzIGxhbmcgZG9lc25cXCd0IGV4aXN0LicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBSZXR1cm4gcmVmZXJlbmNlIGZyb20gcGF0dGVyblxuICAgKiBAcGFyYW0gdHlwZVxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0UmVmZXJlbmNlRnJvbVBhdHRlcm4odHlwZSkge1xuICAgIGlmICghWydvcmRlcicsICdpbnZvaWNlJ10uaW5jbHVkZXModHlwZSkpIHRocm93IG5ldyBFcnJvcignVHlwZSBoYXZlIHRvIGJlIFwib3JkZXJcIiBvciBcImludm9pY2VcIicpO1xuICAgIGlmICh0aGlzLnJlZmVyZW5jZSkgcmV0dXJuIHRoaXMucmVmZXJlbmNlO1xuICAgIHJldHVybiB0aGlzLnNldFJlZmVyZW5jZUZyb21QYXR0ZXJuKCh0eXBlID09PSAnb3JkZXInKSA/IHRoaXMub3JkZXJfcmVmZXJlbmNlX3BhdHRlcm4gOiB0aGlzLmludm9pY2VfcmVmZXJlbmNlX3BhdHRlcm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBTZXQgcmVmZXJlbmNlXG4gICAqIEBwYXJhbSBwYXR0ZXJuXG4gICAqIEByZXR1cm4geyp9XG4gICAqIEBwcml2YXRlXG4gICAqIEB0b2RvIG9wdGltaXplIGl0XG4gICAqL1xuICBzZXRSZWZlcmVuY2VGcm9tUGF0dGVybihwYXR0ZXJuKSB7XG4gICAgY29uc3QgdG1wID0gcGF0dGVybi5zcGxpdCgnJCcpLnNsaWNlKDEpO1xuICAgIGxldCBvdXRwdXQgPSAnJztcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdG1wKSB7XG4gICAgICBpZiAoIWl0ZW0uZW5kc1dpdGgoJ30nKSkgdGhyb3cgbmV3IEVycm9yKCdXcm9uZyBwYXR0ZXJuIHR5cGUnKTtcbiAgICAgIGlmIChpdGVtLnN0YXJ0c1dpdGgoJ3ByZWZpeHsnKSkgb3V0cHV0ICs9IGl0ZW0ucmVwbGFjZSgncHJlZml4eycsICcnKS5zbGljZSgwLCAtMSk7XG4gICAgICBlbHNlIGlmIChpdGVtLnN0YXJ0c1dpdGgoJ3NlcGFyYXRvcnsnKSkgb3V0cHV0ICs9IGl0ZW0ucmVwbGFjZSgnc2VwYXJhdG9yeycsICcnKS5zbGljZSgwLCAtMSk7XG4gICAgICBlbHNlIGlmIChpdGVtLnN0YXJ0c1dpdGgoJ2RhdGV7JykpIG91dHB1dCArPSBtb21lbnQoKS5mb3JtYXQoaXRlbS5yZXBsYWNlKCdkYXRleycsICcnKS5zbGljZSgwLCAtMSkpO1xuICAgICAgZWxzZSBpZiAoaXRlbS5zdGFydHNXaXRoKCdpZHsnKSkge1xuICAgICAgICBjb25zdCBpZCA9IGl0ZW0ucmVwbGFjZSgnaWR7JywgJycpLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgaWYgKCEvXlxcZCskLy50ZXN0KGlkKSkgdGhyb3cgbmV3IEVycm9yKGBJZCBtdXN0IGJlIGFuIGludGVnZXIgKCR7aWR9KWApO1xuICAgICAgICBvdXRwdXQgKz0gKHRoaXMuX2lkKSA/IHRoaXMucGFkKHRoaXMuX2lkLCBpZC5sZW5ndGgpIDogdGhpcy5wYWQoMCwgaWQubGVuZ3RoKTtcbiAgICAgIH0gZWxzZSB0aHJvdyBuZXcgRXJyb3IoYCR7aXRlbX0gcGF0dGVybiByZWZlcmVuY2UgdW5rbm93bmApO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBFeHBvcnQgb2JqZWN0IHdpdGggaHRtbCBjb250ZW50IGFuZCBleHBvcnRhdGlvbiBmdW5jdGlvbnNcbiAgICogQHJldHVybnMge3todG1sOiAqLCB0b0ZpbGU6IChmdW5jdGlvbigqKTogKil9fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3RvSFRNTChrZXlzKSB7XG4gICAgY29uc3QgaHRtbCA9IHRoaXMuX2NvbXBpbGUoa2V5cy5maWxlbmFtZSA9PT0gJ29yZGVyJyA/IHRoaXMuZ2V0T3JkZXIoKSA6IHRoaXMuZ2V0SW52b2ljZSgpKTtcbiAgICByZXR1cm4ge1xuICAgICAgaHRtbCxcbiAgICAgIHRvRmlsZTogKGZpbGVwYXRoKSA9PiB0aGlzLl90b0ZpbGVGcm9tSFRNTChodG1sLCAoZmlsZXBhdGgpIHx8IGAke2tleXMuZmlsZW5hbWV9Lmh0bWxgKSxcbiAgICAgIHRvQnVmZmVyOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoQnVmZmVyLmZyb20oaHRtbCkpXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBjb250ZW50IHRvIHBkZiBmaWxlXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3RvUERGKGtleXMpIHtcbiAgICBjb25zdCBwZGYgPSBodG1sVG9QZGYuY3JlYXRlKHRoaXMuX3RvSFRNTChrZXlzKS5odG1sLCB7dGltZW91dDogJzkwMDAwJywgZm9ybWF0OiAnbGV0dGVyJ30pO1xuICAgIHJldHVybiB7XG4gICAgICBwZGYsXG4gICAgICB0b0ZpbGU6IChmaWxlcGF0aCkgPT4gdGhpcy5fdG9GaWxlRnJvbVBERihwZGYsIChmaWxlcGF0aCkgfHwgYCR7a2V5cy5maWxlbmFtZX0ucGRmYCksXG4gICAgICB0b0J1ZmZlcjogKCkgPT4gdGhpcy5fdG9CdWZmZXJGcm9tUERGKHBkZiksXG4gICAgICB0b1N0cmVhbTogKGZpbGVwYXRoKSA9PiB0aGlzLl90b1N0cmVhbUZyb21QREYocGRmLCAoZmlsZXBhdGgpIHx8IGAke2tleXMuZmlsZW5hbWV9LnBkZmApLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFNhdmUgY29udGVudCBpbnRvIGZpbGUgZnJvbSB0b0hUTUwoKSBtZXRob2RcbiAgICogQHBhcmFtIGNvbnRlbnRcbiAgICogQHBhcmFtIGZpbGVwYXRoXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3RvRmlsZUZyb21IVE1MKGNvbnRlbnQsIGZpbGVwYXRoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IGZzLndyaXRlRmlsZShmaWxlcGF0aCwgY29udGVudCwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikgcmVqZWN0KGVycik7XG4gICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBjb250ZW50IGludG8gZmlsZSBmcm9tIHRvUERGKCkgbWV0aG9kXG4gICAqIEBwYXJhbSBjb250ZW50XG4gICAqIEBwYXJhbSBmaWxlcGF0aFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF90b0ZpbGVGcm9tUERGKGNvbnRlbnQsIGZpbGVwYXRoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IGNvbnRlbnQudG9GaWxlKGZpbGVwYXRoLCAoZXJyLCByZXMpID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgIHJldHVybiByZXNvbHZlKHJlcyk7XG4gICAgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBFeHBvcnQgUERGIHRvIGJ1ZmZlclxuICAgKiBAcGFyYW0gY29udGVudFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF90b0J1ZmZlckZyb21QREYoY29udGVudCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiBjb250ZW50LnRvQnVmZmVyKChlcnIsIGJ1ZmZlcikgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgICAgcmV0dXJuIHJlc29sdmUoYnVmZmVyKTtcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIEV4cG9ydCBQREYgdG8gZmlsZSB1c2luZyBzdHJlYW1cbiAgICogQHBhcmFtIGNvbnRlbnRcbiAgICogQHBhcmFtIGZpbGVwYXRoXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3RvU3RyZWFtRnJvbVBERihjb250ZW50LCBmaWxlcGF0aCkge1xuICAgIHJldHVybiBjb250ZW50LnRvU3RyZWFtKChlcnIsIHN0cmVhbSkgPT4gc3RyZWFtLnBpcGUoZnMuY3JlYXRlV3JpdGVTdHJlYW0oZmlsZXBhdGgpKSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIENhbGN1bGF0ZXMgbnVtYmVyIG9mIHBhZ2VzIGFuZCBpdGVtcyBwZXIgcGFnZVxuICAgKiBAcmV0dXJuIHt7cm93c19pbl9maXJzdF9wYWdlOiBudW1iZXIsIHJvd3NfaW5fb3RoZXJzX3BhZ2VzOiBudW1iZXIsIGxvb3BfdGFibGU6IG51bWJlcn19XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdGVtcGxhdGVDb25maWd1cmF0aW9uKCkge1xuICAgIGNvbnN0IHRlbXBsYXRlX3Jvd3NfcGVyX3BhZ2UgPSAyOTtcbiAgICBjb25zdCB0ZW1wbGF0ZUNvbmZpZyA9IHtcbiAgICAgIHJvd3NfaW5fZmlyc3RfcGFnZTogKHRoaXMuYXJ0aWNsZS5sZW5ndGggPiAxOSkgPyB0ZW1wbGF0ZV9yb3dzX3Blcl9wYWdlIDogMTksXG4gICAgICByb3dzX3Blcl9wYWdlczogNDMsXG4gICAgICByb3dzX2luX2xhc3RfcGFnZTogMzMsXG4gICAgfTtcblxuICAgIGxldCBuYkFydGljbGVzID0gdGhpcy5hcnRpY2xlLmxlbmd0aDtcbiAgICBsZXQgbG9vcCA9IDE7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChsb29wID09PSAxKSB7XG4gICAgICAgIG5iQXJ0aWNsZXMgLT0gdGVtcGxhdGVDb25maWcucm93c19pbl9maXJzdF9wYWdlO1xuICAgICAgICBpZiAobmJBcnRpY2xlcyA8PSAwKSB7XG4gICAgICAgICAgdGVtcGxhdGVDb25maWcubG9vcF90YWJsZSA9ICh0ZW1wbGF0ZUNvbmZpZy5yb3dzX2luX2ZpcnN0X3BhZ2UgIT09IHRlbXBsYXRlX3Jvd3NfcGVyX3BhZ2UpID8gMSA6IDI7XG4gICAgICAgICAgcmV0dXJuIHRlbXBsYXRlQ29uZmlnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChsb29wID49IDIpIHtcbiAgICAgICAgaWYgKG5iQXJ0aWNsZXMgPD0gdGVtcGxhdGVDb25maWcucm93c19pbl9sYXN0X3BhZ2UpIHtcbiAgICAgICAgICB0ZW1wbGF0ZUNvbmZpZy5sb29wX3RhYmxlID0gbG9vcDtcbiAgICAgICAgICByZXR1cm4gdGVtcGxhdGVDb25maWc7XG4gICAgICAgIH1cbiAgICAgICAgbmJBcnRpY2xlcyAtPSB0ZW1wbGF0ZUNvbmZpZy5yb3dzX3Blcl9wYWdlcztcbiAgICAgICAgaWYgKG5iQXJ0aWNsZXMgPD0gMCkge1xuICAgICAgICAgIHRlbXBsYXRlQ29uZmlnLmxvb3BfdGFibGUgPSBsb29wO1xuICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZUNvbmZpZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbG9vcCArPSAxO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gT3ZlcnJpZGVzIGkxOG4gY29uZmlndXJhdGlvblxuICAgKiBAcGFyYW0gY29uZmlnXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaTE4bkNvbmZpZ3VyZShjb25maWcpIHtcbiAgICB0aGlzLl9kZWZhdWx0TG9jYWxlID0gKGNvbmZpZyAmJiBjb25maWcuZGVmYXVsdExvY2FsZSkgPyBjb25maWcuZGVmYXVsdExvY2FsZSA6ICdlbic7XG4gICAgdGhpcy5fYXZhaWxhYmxlTG9jYWxlID0gKGNvbmZpZyAmJiBjb25maWcubG9jYWxlcykgPyBjb25maWcubG9jYWxlcyA6IFsnZW4nLCAnZnInXTtcbiAgICBpZiAoY29uZmlnKSBpMThuLmNvbmZpZ3VyZShjb25maWcpO1xuICB9XG59XG4iXX0=