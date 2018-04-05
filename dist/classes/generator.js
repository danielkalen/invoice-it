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
      toFile: filepath => this._toFileFromHTML(html, filepath || `${keys.filename}.html`)
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
    return content.toBuffer((err, buffer) => {
      if (err) throw new Error(err);
      return buffer;
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzc2VzL2dlbmVyYXRvci5qcyJdLCJuYW1lcyI6WyJHZW5lcmF0b3IiLCJjb25zdHJ1Y3RvciIsImNvbmZpZyIsIl9yZWNpcGllbnQiLCJyZWNpcGllbnQiLCJfZW1pdHRlciIsImVtaXR0ZXIiLCJfdG90YWxfZXhjX3RheGVzIiwiX3RvdGFsX3RheGVzIiwiX3RvdGFsX2luY190YXhlcyIsIl9hcnRpY2xlIiwiX2kxOG5Db25maWd1cmUiLCJsYW5ndWFnZSIsImh5ZHJhdGUiLCJnbG9iYWwiLCJfaXRlbXNUb0h5ZHJhdGUiLCJ0ZW1wbGF0ZSIsIl90ZW1wbGF0ZSIsInZhbHVlIiwibGFuZyIsIl9sYW5nIiwiX2RlZmF1bHRMb2NhbGUiLCJ0bXAiLCJ0b0xvd2VyQ2FzZSIsIl9hdmFpbGFibGVMb2NhbGUiLCJpbmNsdWRlcyIsIkVycm9yIiwiam9pbiIsImlkIiwiX2lkIiwib3JkZXJfcmVmZXJlbmNlX3BhdHRlcm4iLCJfb3JkZXJfcmVmZXJlbmNlX3BhdHRlcm4iLCJpbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuIiwiX2ludm9pY2VfcmVmZXJlbmNlX3BhdHRlcm4iLCJyZWZlcmVuY2UiLCJfcmVmZXJlbmNlIiwibG9nbyIsIl9sb2dvIiwib3JkZXJfdGVtcGxhdGUiLCJfb3JkZXJfdGVtcGxhdGUiLCJpbnZvaWNlX3RlbXBsYXRlIiwiX2ludm9pY2VfdGVtcGxhdGUiLCJvcmRlcl9ub3RlIiwiX29yZGVyX25vdGUiLCJpbnZvaWNlX25vdGUiLCJfaW52b2ljZV9ub3RlIiwiZm9vdGVyIiwiX2Zvb3RlciIsImRhdGVfZm9ybWF0IiwiX2RhdGVfZm9ybWF0IiwiZGF0ZSIsIl9kYXRlIiwiZm9ybWF0IiwiaXNWYWxpZCIsInRvdGFsX2V4Y190YXhlcyIsInRvdGFsX3RheGVzIiwidG90YWxfaW5jX3RheGVzIiwiYXJ0aWNsZSIsIkFycmF5IiwiaXNBcnJheSIsImkiLCJsZW5ndGgiLCJfY2hlY2tBcnRpY2xlIiwidG90YWxfcHJvZHVjdF93aXRob3V0X3RheGVzIiwiZm9ybWF0T3V0cHV0TnVtYmVyIiwicHJpY2UiLCJxdCIsInRvdGFsX3Byb2R1Y3RfdGF4ZXMiLCJyb3VuZCIsInRheCIsInRvdGFsX3Byb2R1Y3Rfd2l0aF90YXhlcyIsIk51bWJlciIsImNvbmNhdCIsImRlbGV0ZUFydGljbGVzIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaXNOdW1lcmljIiwiaXNJbnRlZ2VyIiwib2JqIiwiX3ByZUNvbXBpbGVDb21tb25UcmFuc2xhdGlvbnMiLCJoZWFkZXJfZGF0ZSIsInRhYmxlX2luZm9ybWF0aW9uIiwiX18iLCJwaHJhc2UiLCJsb2NhbGUiLCJ0YWJsZV9kZXNjcmlwdGlvbiIsInRhYmxlX3RheCIsInRhYmxlX3F1YW50aXR5IiwidGFibGVfcHJpY2Vfd2l0aG91dF90YXhlcyIsInRhYmxlX3ByaWNlX3dpdGhvdXRfdGF4ZXNfdW5pdCIsInRhYmxlX25vdGUiLCJ0YWJsZV90b3RhbF93aXRob3V0X3RheGVzIiwidGFibGVfdG90YWxfdGF4ZXMiLCJ0YWJsZV90b3RhbF93aXRoX3RheGVzIiwiZnJvbXRvX3Bob25lIiwiZnJvbXRvX21haWwiLCJnZXRGb290ZXIiLCJlbWl0dGVyX25hbWUiLCJuYW1lIiwiZW1pdHRlcl9zdHJlZXRfbnVtYmVyIiwic3RyZWV0X251bWJlciIsImVtaXR0ZXJfc3RyZWV0X25hbWUiLCJzdHJlZXRfbmFtZSIsImVtaXR0ZXJfemlwX2NvZGUiLCJ6aXBfY29kZSIsImVtaXR0ZXJfY2l0eSIsImNpdHkiLCJlbWl0dGVyX2NvdW50cnkiLCJjb3VudHJ5IiwiZW1pdHRlcl9waG9uZSIsInBob25lIiwiZW1pdHRlcl9tYWlsIiwibWFpbCIsInJlY2lwaWVudF9jb21wYW55IiwiY29tcGFueV9uYW1lIiwicmVjaXBpZW50X2ZpcnN0X25hbWUiLCJmaXJzdF9uYW1lIiwicmVjaXBpZW50X2xhc3RfbmFtZSIsImxhc3RfbmFtZSIsInJlY2lwaWVudF9zdHJlZXRfbnVtYmVyIiwicmVjaXBpZW50X3N0cmVldF9uYW1lIiwicmVjaXBpZW50X3ppcF9jb2RlIiwicmVjaXBpZW50X2NpdHkiLCJyZWNpcGllbnRfY291bnRyeSIsInJlY2lwaWVudF9waG9uZSIsInJlY2lwaWVudF9tYWlsIiwiYXJ0aWNsZXMiLCJ0YWJsZV90b3RhbF93aXRob3V0X3RheGVzX3ZhbHVlIiwidGFibGVfdG90YWxfdGF4ZXNfdmFsdWUiLCJ0YWJsZV90b3RhbF93aXRoX3RheGVzX3ZhbHVlIiwidGVtcGxhdGVfY29uZmlndXJhdGlvbiIsIl90ZW1wbGF0ZUNvbmZpZ3VyYXRpb24iLCJtb21lbnQiLCJfY29tcGlsZSIsImtleXMiLCJmaWxlbmFtZSIsImNvbXBpbGVkIiwiY29tcGlsZUZpbGUiLCJyZXNvbHZlIiwiZ2V0SW52b2ljZSIsImludm9pY2VfaGVhZGVyX3RpdGxlIiwiaW52b2ljZV9oZWFkZXJfc3ViamVjdCIsImludm9pY2VfaGVhZGVyX3JlZmVyZW5jZSIsImludm9pY2VfaGVhZGVyX3JlZmVyZW5jZV92YWx1ZSIsImdldFJlZmVyZW5jZUZyb21QYXR0ZXJuIiwiaW52b2ljZV9oZWFkZXJfZGF0ZSIsInRhYmxlX25vdGVfY29udGVudCIsIm5vdGUiLCJhc3NpZ24iLCJ0b0hUTUwiLCJfdG9IVE1MIiwidG9QREYiLCJfdG9QREYiLCJnZXRPcmRlciIsIm9yZGVyX2hlYWRlcl90aXRsZSIsIm9yZGVyX2hlYWRlcl9zdWJqZWN0Iiwib3JkZXJfaGVhZGVyX3JlZmVyZW5jZSIsIm9yZGVyX2hlYWRlcl9yZWZlcmVuY2VfdmFsdWUiLCJvcmRlcl9oZWFkZXJfZGF0ZSIsImVuIiwiZnIiLCJ0eXBlIiwic2V0UmVmZXJlbmNlRnJvbVBhdHRlcm4iLCJwYXR0ZXJuIiwic3BsaXQiLCJzbGljZSIsIm91dHB1dCIsIml0ZW0iLCJlbmRzV2l0aCIsInN0YXJ0c1dpdGgiLCJyZXBsYWNlIiwidGVzdCIsInBhZCIsImh0bWwiLCJ0b0ZpbGUiLCJmaWxlcGF0aCIsIl90b0ZpbGVGcm9tSFRNTCIsInBkZiIsImNyZWF0ZSIsInRpbWVvdXQiLCJfdG9GaWxlRnJvbVBERiIsInRvQnVmZmVyIiwiX3RvQnVmZmVyRnJvbVBERiIsInRvU3RyZWFtIiwiX3RvU3RyZWFtRnJvbVBERiIsImNvbnRlbnQiLCJQcm9taXNlIiwicmVqZWN0Iiwid3JpdGVGaWxlIiwiZXJyIiwicmVzIiwiYnVmZmVyIiwic3RyZWFtIiwicGlwZSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwidGVtcGxhdGVfcm93c19wZXJfcGFnZSIsInRlbXBsYXRlQ29uZmlnIiwicm93c19pbl9maXJzdF9wYWdlIiwicm93c19wZXJfcGFnZXMiLCJyb3dzX2luX2xhc3RfcGFnZSIsIm5iQXJ0aWNsZXMiLCJsb29wIiwibG9vcF90YWJsZSIsImRlZmF1bHRMb2NhbGUiLCJsb2NhbGVzIiwiY29uZmlndXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLFNBQU4sMEJBQStCO0FBQzVDQyxjQUFZQyxNQUFaLEVBQW9CO0FBQ2xCO0FBQ0EsU0FBS0MsVUFBTCxHQUFtQkQsT0FBT0UsU0FBUixHQUFxQix3QkFBY0YsT0FBT0UsU0FBckIsQ0FBckIsR0FBdUQseUJBQXpFO0FBQ0EsU0FBS0MsUUFBTCxHQUFpQkgsT0FBT0ksT0FBUixHQUFtQixzQkFBWUosT0FBT0ksT0FBbkIsQ0FBbkIsR0FBaUQsdUJBQWpFO0FBQ0EsU0FBS0MsZ0JBQUwsR0FBd0IsQ0FBeEI7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLENBQXBCO0FBQ0EsU0FBS0MsZ0JBQUwsR0FBd0IsQ0FBeEI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsU0FBS0MsY0FBTCxDQUFvQlQsT0FBT1UsUUFBM0I7QUFDQSxTQUFLQyxPQUFMLENBQWFYLE9BQU9ZLE1BQXBCLEVBQTRCLEtBQUtDLGVBQUwsRUFBNUI7QUFDRDs7QUFFRCxNQUFJQyxRQUFKLEdB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QWVHLGlCQUFqQyxFQUFvRDtBQUNsREgseUJBQWVNLFVBQWYsR0FBNEJELElBQTVCO0FBQ0EsaUJBQU9MLGNBQVA7QUFDRDtBQUNESSxzQkFBY0osZUFBZUUsY0FBN0I7QUFDQSxZQUFJRSxjQUFjLENBQWxCLEVBQXFCO0FBQ25CSix5QkFBZU0sVUFBZixHQUE0QkQsSUFBNUI7QUFDQSxpQkFBT0wsY0FBUDtBQUNEO0FBQ0Y7QUFDREssY0FBUSxDQUFSO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7QUFLQWhNLGlCQUFlVCxNQUFmLEVBQXVCO0FBQ3JCLFNBQUttQixjQUFMLEdBQXVCbkIsVUFBVUEsT0FBTzJNLGFBQWxCLEdBQW1DM00sT0FBTzJNLGFBQTFDLEdBQTBELElBQWhGO0FBQ0EsU0FBS3JMLGdCQUFMLEdBQXlCdEIsVUFBVUEsT0FBTzRNLE9BQWxCLEdBQTZCNU0sT0FBTzRNLE9BQXBDLEdBQThDLENBQUMsSUFBRCxFQUFPLElBQVAsQ0FBdEU7QUFDQSxRQUFJNU0sTUFBSixFQUFZLGVBQUs2TSxTQUFMLENBQWU3TSxNQUFmO0FBQ2I7QUFoaEIyQztrQkFBekJGLFMiLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHB1ZyBmcm9tICdwdWcnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGh0bWxUb1BkZiBmcm9tICdodG1sLXBkZic7XG5pbXBvcnQgQ29tbW9uIGZyb20gJy4vY29tbW9uJztcbmltcG9ydCBSZWNpcGllbnQgZnJvbSAnLi9yZWNpcGllbnQnO1xuaW1wb3J0IEVtaXR0ZXIgZnJvbSAnLi9lbWl0dGVyJztcbmltcG9ydCBpMThuIGZyb20gJy4uL2xpYi9pMThuJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXJhdG9yIGV4dGVuZHMgQ29tbW9uIHtcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9yZWNpcGllbnQgPSAoY29uZmlnLnJlY2lwaWVudCkgPyBuZXcgUmVjaXBpZW50KGNvbmZpZy5yZWNpcGllbnQpIDogbmV3IFJlY2lwaWVudCgpO1xuICAgIHRoaXMuX2VtaXR0ZXIgPSAoY29uZmlnLmVtaXR0ZXIpID8gbmV3IEVtaXR0ZXIoY29uZmlnLmVtaXR0ZXIpIDogbmV3IEVtaXR0ZXIoKTtcbiAgICB0aGlzLl90b3RhbF9leGNfdGF4ZXMgPSAwO1xuICAgIHRoaXMuX3RvdGFsX3RheGVzID0gMDtcbiAgICB0aGlzLl90b3RhbF9pbmNfdGF4ZXMgPSAwO1xuICAgIHRoaXMuX2FydGljbGUgPSBbXTtcbiAgICB0aGlzLl9pMThuQ29uZmlndXJlKGNvbmZpZy5sYW5ndWFnZSk7XG4gICAgdGhpcy5oeWRyYXRlKGNvbmZpZy5nbG9iYWwsIHRoaXMuX2l0ZW1zVG9IeWRyYXRlKCkpO1xuICB9XG5cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZTtcbiAgfVxuXG4gIHNldCB0ZW1wbGF0ZSh2YWx1ZSkge1xuICAgIHRoaXMuX3RlbXBsYXRlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgbGFuZygpIHtcbiAgICByZXR1cm4gKCF0aGlzLl9sYW5nKSA/IHRoaXMuX2RlZmF1bHRMb2NhbGUgOiB0aGlzLl9sYW5nO1xuICB9XG5cbiAgc2V0IGxhbmcodmFsdWUpIHtcbiAgICBjb25zdCB0bXAgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICghdGhpcy5fYXZhaWxhYmxlTG9jYWxlLmluY2x1ZGVzKHRtcCkpIHRocm93IG5ldyBFcnJvcihgV3JvbmcgbGFuZywgcGxlYXNlIHNldCBvbmUgb2YgJHt0aGlzLl9hdmFpbGFibGVMb2NhbGUuam9pbignLCAnKX1gKTtcbiAgICB0aGlzLl9sYW5nID0gdG1wO1xuICB9XG5cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLl9pZDtcbiAgfVxuXG4gIHNldCBpZCh2YWx1ZSkge1xuICAgIHRoaXMuX2lkID0gdmFsdWU7XG4gIH1cblxuICBnZXQgb3JkZXJfcmVmZXJlbmNlX3BhdHRlcm4oKSB7XG4gICAgcmV0dXJuICghdGhpcy5fb3JkZXJfcmVmZXJlbmNlX3BhdHRlcm4pID8gJyRwcmVmaXh7T1J9JGRhdGV7WVlNTX0kc2VwYXJhdG9yey19JGlkezAwMDAwfScgOiB0aGlzLl9vcmRlcl9yZWZlcmVuY2VfcGF0dGVybjtcbiAgfVxuXG4gIHNldCBvcmRlcl9yZWZlcmVuY2VfcGF0dGVybih2YWx1ZSkge1xuICAgIHRoaXMuX29yZGVyX3JlZmVyZW5jZV9wYXR0ZXJuID0gdmFsdWU7XG4gIH1cblxuICBnZXQgaW52b2ljZV9yZWZlcmVuY2VfcGF0dGVybigpIHtcbiAgICByZXR1cm4gKCF0aGlzLl9pbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuKSA/ICckcHJlZml4e0lOfSRkYXRle1lZTU19JHNlcGFyYXRvcnstfSRpZHswMDAwMH0nIDogdGhpcy5faW52b2ljZV9yZWZlcmVuY2VfcGF0dGVybjtcbiAgfVxuXG4gIHNldCBpbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuKHZhbHVlKSB7XG4gICAgdGhpcy5faW52b2ljZV9yZWZlcmVuY2VfcGF0dGVybiA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHJlZmVyZW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVmZXJlbmNlO1xuICB9XG5cbiAgc2V0IHJlZmVyZW5jZSh2YWx1ZSkge1xuICAgIHRoaXMuX3JlZmVyZW5jZSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGxvZ28oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvZ287XG4gIH1cblxuICBzZXQgbG9nbyh2YWx1ZSkge1xuICAgIHRoaXMuX2xvZ28gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBvcmRlcl90ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fb3JkZXJfdGVtcGxhdGU7XG4gIH1cblxuICBzZXQgb3JkZXJfdGVtcGxhdGUodmFsdWUpIHtcbiAgICB0aGlzLl9vcmRlcl90ZW1wbGF0ZSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGludm9pY2VfdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ludm9pY2VfdGVtcGxhdGU7XG4gIH1cblxuICBzZXQgaW52b2ljZV90ZW1wbGF0ZSh2YWx1ZSkge1xuICAgIHRoaXMuX2ludm9pY2VfdGVtcGxhdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBvcmRlcl9ub3RlKCkge1xuICAgIHJldHVybiB0aGlzLl9vcmRlcl9ub3RlO1xuICB9XG5cbiAgc2V0IG9yZGVyX25vdGUodmFsdWUpIHtcbiAgICB0aGlzLl9vcmRlcl9ub3RlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgaW52b2ljZV9ub3RlKCkge1xuICAgIHJldHVybiB0aGlzLl9pbnZvaWNlX25vdGU7XG4gIH1cblxuICBzZXQgaW52b2ljZV9ub3RlKHZhbHVlKSB7XG4gICAgdGhpcy5faW52b2ljZV9ub3RlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZm9vdGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9mb290ZXI7XG4gIH1cblxuICBzZXQgZm9vdGVyKHZhbHVlKSB7XG4gICAgdGhpcy5fZm9vdGVyID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZGF0ZV9mb3JtYXQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5fZGF0ZV9mb3JtYXQpID8gJ1lZWVkvTU0vREQnIDogdGhpcy5fZGF0ZV9mb3JtYXQ7XG4gIH1cblxuICBzZXQgZGF0ZV9mb3JtYXQodmFsdWUpIHtcbiAgICB0aGlzLl9kYXRlX2Zvcm1hdCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGRhdGUoKSB7XG4gICAgcmV0dXJuICghdGhpcy5fZGF0ZSkgPyBtb21lbnQoKS5mb3JtYXQodGhpcy5kYXRlX2Zvcm1hdCkgOiB0aGlzLl9kYXRlO1xuICB9XG5cbiAgc2V0IGRhdGUodmFsdWUpIHtcbiAgICBpZiAoIW1vbWVudCh2YWx1ZSkuaXNWYWxpZCgpKSB0aHJvdyBuZXcgRXJyb3IoJ0RhdGUgbm90IHZhbGlkJyk7XG4gICAgdGhpcy5fZGF0ZSA9IG1vbWVudCh2YWx1ZSkuZm9ybWF0KHRoaXMuZGF0ZV9mb3JtYXQpO1xuICB9XG5cbiAgZ2V0IHRvdGFsX2V4Y190YXhlcygpIHtcbiAgICByZXR1cm4gdGhpcy5fdG90YWxfZXhjX3RheGVzO1xuICB9XG5cbiAgc2V0IHRvdGFsX2V4Y190YXhlcyh2YWx1ZSkge1xuICAgIHRoaXMuX3RvdGFsX2V4Y190YXhlcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHRvdGFsX3RheGVzKCkge1xuICAgIHJldHVybiB0aGlzLl90b3RhbF90YXhlcztcbiAgfVxuXG4gIHNldCB0b3RhbF90YXhlcyh2YWx1ZSkge1xuICAgIHRoaXMuX3RvdGFsX3RheGVzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgdG90YWxfaW5jX3RheGVzKCkge1xuICAgIHJldHVybiB0aGlzLl90b3RhbF9pbmNfdGF4ZXM7XG4gIH1cblxuICBzZXQgdG90YWxfaW5jX3RheGVzKHZhbHVlKSB7XG4gICAgdGhpcy5fdG90YWxfaW5jX3RheGVzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgYXJ0aWNsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXJ0aWNsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gU2V0XG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKiBAZXhhbXBsZSBhcnRpY2xlKHtkZXNjcmlwdGlvbjogJ0xpY2VuY2UnLCB0YXg6IDIwLCBwcmljZTogMTAwLCBxdDogMX0pXG4gICAqIEBleGFtcGxlIGFydGljbGUoW1xuICAgKiAge2Rlc2NyaXB0aW9uOiAnTGljZW5jZScsIHRheDogMjAsIHByaWNlOiAxMDAsIHF0OiAxfSxcbiAgICogIHtkZXNjcmlwdGlvbjogJ0xpY2VuY2UnLCB0YXg6IDIwLCBwcmljZTogMTAwLCBxdDogMX1cbiAgICogXSlcbiAgICovXG4gIHNldCBhcnRpY2xlKHZhbHVlKSB7XG4gICAgY29uc3QgdG1wID0gdmFsdWU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodG1wKSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXAubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tBcnRpY2xlKHRtcFtpXSk7XG4gICAgICAgIHRtcFtpXS50b3RhbF9wcm9kdWN0X3dpdGhvdXRfdGF4ZXMgPSB0aGlzLmZvcm1hdE91dHB1dE51bWJlcih0bXBbaV0ucHJpY2UgKiB0bXBbaV0ucXQpO1xuICAgICAgICB0bXBbaV0udG90YWxfcHJvZHVjdF90YXhlcyA9IHRoaXMuZm9ybWF0T3V0cHV0TnVtYmVyKHRoaXMucm91bmQodG1wW2ldLnRvdGFsX3Byb2R1Y3Rfd2l0aG91dF90YXhlcyAqICh0bXBbaV0udGF4IC8gMTAwKSkpO1xuICAgICAgICB0bXBbaV0udG90YWxfcHJvZHVjdF93aXRoX3RheGVzID0gdGhpcy5mb3JtYXRPdXRwdXROdW1iZXIodGhpcy5yb3VuZChOdW1iZXIodG1wW2ldLnRvdGFsX3Byb2R1Y3Rfd2l0aG91dF90YXhlcykgKyBOdW1iZXIodG1wW2ldLnRvdGFsX3Byb2R1Y3RfdGF4ZXMpKSk7XG4gICAgICAgIHRtcFtpXS5wcmljZSA9IHRoaXMuZm9ybWF0T3V0cHV0TnVtYmVyKHRtcFtpXS5wcmljZSk7XG4gICAgICAgIHRtcFtpXS50YXggPSB0aGlzLmZvcm1hdE91dHB1dE51bWJlcih0bXBbaV0udGF4KTtcbiAgICAgICAgdGhpcy50b3RhbF9leGNfdGF4ZXMgKz0gTnVtYmVyKHRtcFtpXS50b3RhbF9wcm9kdWN0X3dpdGhvdXRfdGF4ZXMpO1xuICAgICAgICB0aGlzLnRvdGFsX2luY190YXhlcyArPSBOdW1iZXIodG1wW2ldLnRvdGFsX3Byb2R1Y3Rfd2l0aF90YXhlcyk7XG4gICAgICAgIHRoaXMudG90YWxfdGF4ZXMgKz0gTnVtYmVyKHRtcFtpXS50b3RhbF9wcm9kdWN0X3RheGVzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY2hlY2tBcnRpY2xlKHRtcCk7XG4gICAgICB0bXAudG90YWxfcHJvZHVjdF93aXRob3V0X3RheGVzID0gdGhpcy5mb3JtYXRPdXRwdXROdW1iZXIodG1wLnByaWNlICogdG1wLnF0KTtcbiAgICAgIHRtcC50b3RhbF9wcm9kdWN0X3RheGVzID0gdGhpcy5mb3JtYXRPdXRwdXROdW1iZXIodGhpcy5yb3VuZCh0bXAudG90YWxfcHJvZHVjdF93aXRob3V0X3RheGVzICogKHRtcC50YXggLyAxMDApKSk7XG4gICAgICB0bXAudG90YWxfcHJvZHVjdF93aXRoX3RheGVzID0gdGhpcy5mb3JtYXRPdXRwdXROdW1iZXIodGhpcy5yb3VuZChOdW1iZXIodG1wLnRvdGFsX3Byb2R1Y3Rfd2l0aG91dF90YXhlcykgKyBOdW1iZXIodG1wLnRvdGFsX3Byb2R1Y3RfdGF4ZXMpKSk7XG4gICAgICB0bXAucHJpY2UgPSB0aGlzLmZvcm1hdE91dHB1dE51bWJlcih0bXAucHJpY2UpO1xuICAgICAgdG1wLnRheCA9IHRoaXMuZm9ybWF0T3V0cHV0TnVtYmVyKHRtcC50YXgpO1xuICAgICAgdGhpcy50b3RhbF9leGNfdGF4ZXMgKz0gTnVtYmVyKHRtcC50b3RhbF9wcm9kdWN0X3dpdGhvdXRfdGF4ZXMpO1xuICAgICAgdGhpcy50b3RhbF9pbmNfdGF4ZXMgKz0gTnVtYmVyKHRtcC50b3RhbF9wcm9kdWN0X3dpdGhfdGF4ZXMpO1xuICAgICAgdGhpcy50b3RhbF90YXhlcyArPSBOdW1iZXIodG1wLnRvdGFsX3Byb2R1Y3RfdGF4ZXMpO1xuICAgIH1cbiAgICB0aGlzLl9hcnRpY2xlID0gKHRoaXMuX2FydGljbGUpID8gdGhpcy5fYXJ0aWNsZS5jb25jYXQodG1wKSA6IFtdLmNvbmNhdCh0bXApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBSZWluaXRpYWxpemUgYXJ0aWNsZSBhdHRyaWJ1dGVcbiAgICovXG4gIGRlbGV0ZUFydGljbGVzKCkge1xuICAgIHRoaXMuX3RvdGFsX2luY190YXhlcyA9IDA7XG4gICAgdGhpcy5fdG90YWxfdGF4ZXMgPSAwO1xuICAgIHRoaXMuX3RvdGFsX2V4Y190YXhlcyA9IDA7XG4gICAgdGhpcy5fYXJ0aWNsZSA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBDaGVjayBhcnRpY2xlIHN0cnVjdHVyZSBhbmQgZGF0YVxuICAgKiBAcGFyYW0gYXJ0aWNsZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NoZWNrQXJ0aWNsZShhcnRpY2xlKSB7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXJ0aWNsZSwgJ2Rlc2NyaXB0aW9uJykpIHRocm93IG5ldyBFcnJvcignRGVzY3JpcHRpb24gYXR0cmlidXRlIGlzIG1pc3NpbmcnKTtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcnRpY2xlLCAndGF4JykpIHRocm93IG5ldyBFcnJvcignVGF4IGF0dHJpYnV0ZSBpcyBtaXNzaW5nJyk7XG4gICAgaWYgKCF0aGlzLmlzTnVtZXJpYyhhcnRpY2xlLnRheCkpIHRocm93IG5ldyBFcnJvcignVGF4IGF0dHJpYnV0ZSBoYXZlIHRvIGJlIGEgbnVtYmVyJyk7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXJ0aWNsZSwgJ3ByaWNlJykpIHRocm93IG5ldyBFcnJvcignUHJpY2UgYXR0cmlidXRlIGlzIG1pc3NpbmcnKTtcbiAgICBpZiAoIXRoaXMuaXNOdW1lcmljKGFydGljbGUucHJpY2UpKSB0aHJvdyBuZXcgRXJyb3IoJ1ByaWNlIGF0dHJpYnV0ZSBoYXZlIHRvIGJlIGEgbnVtYmVyJyk7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXJ0aWNsZSwgJ3F0JykpIHRocm93IG5ldyBFcnJvcignUXQgYXR0cmlidXRlIGlzIG1pc3NpbmcnKTtcbiAgICBpZiAoIXRoaXMuaXNOdW1lcmljKGFydGljbGUucXQpKSB0aHJvdyBuZXcgRXJyb3IoJ1F0IGF0dHJpYnV0ZSBoYXZlIHRvIGJlIGFuIGludGVnZXInKTtcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIoYXJ0aWNsZS5xdCkpIHRocm93IG5ldyBFcnJvcignUXQgYXR0cmlidXRlIGhhdmUgdG8gYmUgYW4gaW50ZWdlciwgbm90IGEgZmxvYXQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gSHlkcmF0ZSBmcm9tIGNvbmZpZ3VyYXRpb25cbiAgICogQHJldHVybnMge1tzdHJpbmcsc3RyaW5nLHN0cmluZyxzdHJpbmddfVxuICAgKi9cbiAgX2l0ZW1zVG9IeWRyYXRlKCkge1xuICAgIHJldHVybiBbJ2xvZ28nLCAnb3JkZXJfdGVtcGxhdGUnLCAnaW52b2ljZV90ZW1wbGF0ZScsICdkYXRlX2Zvcm1hdCcsICdvcmRlcl9yZWZlcmVuY2VfcGF0dGVybicsICdpbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuJywgJ29yZGVyX25vdGUnLCAnaW52b2ljZV9ub3RlJywgJ2xhbmcnLCAnZm9vdGVyJ107XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIEh5ZHJhdGUgcmVjaXBpZW50IG9iamVjdFxuICAgKiBAcGFyYW0gb2JqXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgcmVjaXBpZW50KG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm4gdGhpcy5fcmVjaXBpZW50O1xuICAgIHJldHVybiB0aGlzLl9yZWNpcGllbnQuaHlkcmF0ZShvYmosIHRoaXMuX3JlY2lwaWVudC5faXRlbXNUb0h5ZHJhdGUoKSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIEh5ZHJhdGUgZW1pdHRlciBvYmplY3RcbiAgICogQHBhcmFtIG9ialxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGVtaXR0ZXIob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiB0aGlzLl9lbWl0dGVyO1xuICAgIHJldHVybiB0aGlzLl9lbWl0dGVyLmh5ZHJhdGUob2JqLCB0aGlzLl9lbWl0dGVyLl9pdGVtc1RvSHlkcmF0ZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gUHJlY29tcGlsZSB0cmFuc2xhdGlvbiB0byBtZXJnaW5nIGdsYWJhbCB3aXRoIGN1c3RvbSB0cmFuc2xhdGlvbnNcbiAgICogQHJldHVybnMge3tsb2dvOiAqLCBoZWFkZXJfZGF0ZTogKiwgdGFibGVfaW5mb3JtYXRpb24sIHRhYmxlX2Rlc2NyaXB0aW9uLCB0YWJsZV90YXgsIHRhYmxlX3F1YW50aXR5LFxuICAgKiB0YWJsZV9wcmljZV93aXRob3V0X3RheGVzLCB0YWJsZV9wcmljZV93aXRob3V0X3RheGVzX3VuaXQsIHRhYmxlX25vdGUsIHRhYmxlX3RvdGFsX3dpdGhvdXRfdGF4ZXMsXG4gICAqIHRhYmxlX3RvdGFsX3RheGVzLCB0YWJsZV90b3RhbF93aXRoX3RheGVzLCBmcm9tdG9fcGhvbmUsIGZyb210b19tYWlsLCBmb290ZXIsIG1vbWVudDogKCp8bW9tZW50Lk1vbWVudCl9fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3ByZUNvbXBpbGVDb21tb25UcmFuc2xhdGlvbnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxvZ286IHRoaXMubG9nbyxcbiAgICAgIGhlYWRlcl9kYXRlOiB0aGlzLmRhdGUsXG4gICAgICB0YWJsZV9pbmZvcm1hdGlvbjogaTE4bi5fXyh7cGhyYXNlOiAndGFibGVfaW5mb3JtYXRpb24nLCBsb2NhbGU6IHRoaXMubGFuZ30pLFxuICAgICAgdGFibGVfZGVzY3JpcHRpb246IGkxOG4uX18oe3BocmFzZTogJ3RhYmxlX2Rlc2NyaXB0aW9uJywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIHRhYmxlX3RheDogaTE4bi5fXyh7cGhyYXNlOiAndGFibGVfdGF4JywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIHRhYmxlX3F1YW50aXR5OiBpMThuLl9fKHtwaHJhc2U6ICd0YWJsZV9xdWFudGl0eScsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICB0YWJsZV9wcmljZV93aXRob3V0X3RheGVzOiBpMThuLl9fKHtwaHJhc2U6ICd0YWJsZV9wcmljZV93aXRob3V0X3RheGVzJywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIHRhYmxlX3ByaWNlX3dpdGhvdXRfdGF4ZXNfdW5pdDogaTE4bi5fXyh7cGhyYXNlOiAndGFibGVfcHJpY2Vfd2l0aG91dF90YXhlc191bml0JywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIHRhYmxlX25vdGU6IGkxOG4uX18oe3BocmFzZTogJ3RhYmxlX25vdGUnLCBsb2NhbGU6IHRoaXMubGFuZ30pLFxuICAgICAgdGFibGVfdG90YWxfd2l0aG91dF90YXhlczogaTE4bi5fXyh7cGhyYXNlOiAndGFibGVfdG90YWxfd2l0aG91dF90YXhlcycsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICB0YWJsZV90b3RhbF90YXhlczogaTE4bi5fXyh7cGhyYXNlOiAndGFibGVfdG90YWxfdGF4ZXMnLCBsb2NhbGU6IHRoaXMubGFuZ30pLFxuICAgICAgdGFibGVfdG90YWxfd2l0aF90YXhlczogaTE4bi5fXyh7cGhyYXNlOiAndGFibGVfdG90YWxfd2l0aF90YXhlcycsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICBmcm9tdG9fcGhvbmU6IGkxOG4uX18oe3BocmFzZTogJ2Zyb210b19waG9uZScsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICBmcm9tdG9fbWFpbDogaTE4bi5fXyh7cGhyYXNlOiAnZnJvbXRvX21haWwnLCBsb2NhbGU6IHRoaXMubGFuZ30pLFxuICAgICAgZm9vdGVyOiB0aGlzLmdldEZvb3RlcigpLFxuICAgICAgZW1pdHRlcl9uYW1lOiB0aGlzLmVtaXR0ZXIoKS5uYW1lLFxuICAgICAgZW1pdHRlcl9zdHJlZXRfbnVtYmVyOiB0aGlzLmVtaXR0ZXIoKS5zdHJlZXRfbnVtYmVyLFxuICAgICAgZW1pdHRlcl9zdHJlZXRfbmFtZTogdGhpcy5lbWl0dGVyKCkuc3RyZWV0X25hbWUsXG4gICAgICBlbWl0dGVyX3ppcF9jb2RlOiB0aGlzLmVtaXR0ZXIoKS56aXBfY29kZSxcbiAgICAgIGVtaXR0ZXJfY2l0eTogdGhpcy5lbWl0dGVyKCkuY2l0eSxcbiAgICAgIGVtaXR0ZXJfY291bnRyeTogdGhpcy5lbWl0dGVyKCkuY291bnRyeSxcbiAgICAgIGVtaXR0ZXJfcGhvbmU6IHRoaXMuZW1pdHRlcigpLnBob25lLFxuICAgICAgZW1pdHRlcl9tYWlsOiB0aGlzLmVtaXR0ZXIoKS5tYWlsLFxuICAgICAgcmVjaXBpZW50X2NvbXBhbnk6IHRoaXMucmVjaXBpZW50KCkuY29tcGFueV9uYW1lLFxuICAgICAgcmVjaXBpZW50X2ZpcnN0X25hbWU6IHRoaXMucmVjaXBpZW50KCkuZmlyc3RfbmFtZSxcbiAgICAgIHJlY2lwaWVudF9sYXN0X25hbWU6IHRoaXMucmVjaXBpZW50KCkubGFzdF9uYW1lLFxuICAgICAgcmVjaXBpZW50X3N0cmVldF9udW1iZXI6IHRoaXMucmVjaXBpZW50KCkuc3RyZWV0X251bWJlcixcbiAgICAgIHJlY2lwaWVudF9zdHJlZXRfbmFtZTogdGhpcy5yZWNpcGllbnQoKS5zdHJlZXRfbmFtZSxcbiAgICAgIHJlY2lwaWVudF96aXBfY29kZTogdGhpcy5yZWNpcGllbnQoKS56aXBfY29kZSxcbiAgICAgIHJlY2lwaWVudF9jaXR5OiB0aGlzLnJlY2lwaWVudCgpLmNpdHksXG4gICAgICByZWNpcGllbnRfY291bnRyeTogdGhpcy5yZWNpcGllbnQoKS5jb3VudHJ5LFxuICAgICAgcmVjaXBpZW50X3Bob25lOiB0aGlzLnJlY2lwaWVudCgpLnBob25lLFxuICAgICAgcmVjaXBpZW50X21haWw6IHRoaXMucmVjaXBpZW50KCkubWFpbCxcbiAgICAgIGFydGljbGVzOiB0aGlzLmFydGljbGUsXG4gICAgICB0YWJsZV90b3RhbF93aXRob3V0X3RheGVzX3ZhbHVlOiB0aGlzLmZvcm1hdE91dHB1dE51bWJlcih0aGlzLnRvdGFsX2V4Y190YXhlcyksXG4gICAgICB0YWJsZV90b3RhbF90YXhlc192YWx1ZTogdGhpcy5mb3JtYXRPdXRwdXROdW1iZXIodGhpcy50b3RhbF90YXhlcyksXG4gICAgICB0YWJsZV90b3RhbF93aXRoX3RheGVzX3ZhbHVlOiB0aGlzLmZvcm1hdE91dHB1dE51bWJlcih0aGlzLnRvdGFsX2luY190YXhlcyksXG4gICAgICB0ZW1wbGF0ZV9jb25maWd1cmF0aW9uOiB0aGlzLl90ZW1wbGF0ZUNvbmZpZ3VyYXRpb24oKSxcbiAgICAgIG1vbWVudDogbW9tZW50KCksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gQ29tcGlsZSBwdWcgdGVtcGxhdGUgdG8gSFRNTFxuICAgKiBAcGFyYW0ga2V5c1xuICAgKiBAcmV0dXJucyB7Kn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jb21waWxlKGtleXMpIHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGtleXMuZmlsZW5hbWUgPT09ICdvcmRlcicgPyB0aGlzLm9yZGVyX3RlbXBsYXRlIDogdGhpcy5pbnZvaWNlX3RlbXBsYXRlO1xuICAgIGNvbnN0IGNvbXBpbGVkID0gcHVnLmNvbXBpbGVGaWxlKHBhdGgucmVzb2x2ZSh0ZW1wbGF0ZSkpO1xuICAgIHJldHVybiBjb21waWxlZChrZXlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gUmV0dXJuIGludm9pY2UgdHJhbnNsYXRpb24ga2V5cyBvYmplY3RcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBnZXRJbnZvaWNlKCkge1xuICAgIGNvbnN0IGtleXMgPSB7XG4gICAgICBpbnZvaWNlX2hlYWRlcl90aXRsZTogaTE4bi5fXyh7cGhyYXNlOiAnaW52b2ljZV9oZWFkZXJfdGl0bGUnLCBsb2NhbGU6IHRoaXMubGFuZ30pLFxuICAgICAgaW52b2ljZV9oZWFkZXJfc3ViamVjdDogaTE4bi5fXyh7cGhyYXNlOiAnaW52b2ljZV9oZWFkZXJfc3ViamVjdCcsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICBpbnZvaWNlX2hlYWRlcl9yZWZlcmVuY2U6IGkxOG4uX18oe3BocmFzZTogJ2ludm9pY2VfaGVhZGVyX3JlZmVyZW5jZScsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICBpbnZvaWNlX2hlYWRlcl9yZWZlcmVuY2VfdmFsdWU6IHRoaXMuZ2V0UmVmZXJlbmNlRnJvbVBhdHRlcm4oJ2ludm9pY2UnKSxcbiAgICAgIGludm9pY2VfaGVhZGVyX2RhdGU6IGkxOG4uX18oe3BocmFzZTogJ2ludm9pY2VfaGVhZGVyX2RhdGUnLCBsb2NhbGU6IHRoaXMubGFuZ30pLFxuICAgICAgdGFibGVfbm90ZV9jb250ZW50OiB0aGlzLmludm9pY2Vfbm90ZSxcbiAgICAgIG5vdGU6IChub3RlKSA9PiAoKG5vdGUpID8gdGhpcy5pbnZvaWNlX25vdGUgPSBub3RlIDogdGhpcy5pbnZvaWNlX25vdGUpLFxuICAgICAgZmlsZW5hbWU6ICdpbnZvaWNlJyxcbiAgICB9O1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGtleXMsIHtcbiAgICAgIHRvSFRNTDogKCkgPT4gdGhpcy5fdG9IVE1MKGtleXMpLFxuICAgICAgdG9QREY6ICgpID0+IHRoaXMuX3RvUERGKGtleXMpLFxuICAgIH0sIHRoaXMuX3ByZUNvbXBpbGVDb21tb25UcmFuc2xhdGlvbnMoKSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFJldHVybiBvcmRlciB0cmFuc2xhdGlvbiBrZXlzIG9iamVjdFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGdldE9yZGVyKCkge1xuICAgIGNvbnN0IGtleXMgPSB7XG4gICAgICBvcmRlcl9oZWFkZXJfdGl0bGU6IGkxOG4uX18oe3BocmFzZTogJ29yZGVyX2hlYWRlcl90aXRsZScsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICBvcmRlcl9oZWFkZXJfc3ViamVjdDogaTE4bi5fXyh7cGhyYXNlOiAnb3JkZXJfaGVhZGVyX3N1YmplY3QnLCBsb2NhbGU6IHRoaXMubGFuZ30pLFxuICAgICAgb3JkZXJfaGVhZGVyX3JlZmVyZW5jZTogaTE4bi5fXyh7cGhyYXNlOiAnb3JkZXJfaGVhZGVyX3JlZmVyZW5jZScsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICBvcmRlcl9oZWFkZXJfcmVmZXJlbmNlX3ZhbHVlOiB0aGlzLmdldFJlZmVyZW5jZUZyb21QYXR0ZXJuKCdvcmRlcicpLFxuICAgICAgb3JkZXJfaGVhZGVyX2RhdGU6IGkxOG4uX18oe3BocmFzZTogJ29yZGVyX2hlYWRlcl9kYXRlJywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIHRhYmxlX25vdGVfY29udGVudDogdGhpcy5vcmRlcl9ub3RlLFxuICAgICAgbm90ZTogKG5vdGUpID0+ICgobm90ZSkgPyB0aGlzLm9yZGVyX25vdGUgPSBub3RlIDogdGhpcy5vcmRlcl9ub3RlKSxcbiAgICAgIGZpbGVuYW1lOiAnb3JkZXInLFxuICAgIH07XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oa2V5cywge1xuICAgICAgdG9IVE1MOiAoKSA9PiB0aGlzLl90b0hUTUwoa2V5cyksXG4gICAgICB0b1BERjogKCkgPT4gdGhpcy5fdG9QREYoa2V5cyksXG4gICAgfSwgdGhpcy5fcHJlQ29tcGlsZUNvbW1vblRyYW5zbGF0aW9ucygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gUmV0dXJuIHJpZ2h0IGZvb3RlclxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGdldEZvb3RlcigpIHtcbiAgICBpZiAoIXRoaXMuZm9vdGVyKSByZXR1cm4gaTE4bi5fXyh7cGhyYXNlOiAnZm9vdGVyJywgbG9jYWxlOiB0aGlzLmxhbmd9KTtcblxuICAgIGlmICh0aGlzLmxhbmcgPT09ICdlbicpIHJldHVybiB0aGlzLmZvb3Rlci5lbjtcbiAgICBlbHNlIGlmICh0aGlzLmxhbmcgPT09ICdmcicpIHJldHVybiB0aGlzLmZvb3Rlci5mcjtcbiAgICB0aHJvdyBFcnJvcignVGhpcyBsYW5nIGRvZXNuXFwndCBleGlzdC4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gUmV0dXJuIHJlZmVyZW5jZSBmcm9tIHBhdHRlcm5cbiAgICogQHBhcmFtIHR5cGVcbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldFJlZmVyZW5jZUZyb21QYXR0ZXJuKHR5cGUpIHtcbiAgICBpZiAoIVsnb3JkZXInLCAnaW52b2ljZSddLmluY2x1ZGVzKHR5cGUpKSB0aHJvdyBuZXcgRXJyb3IoJ1R5cGUgaGF2ZSB0byBiZSBcIm9yZGVyXCIgb3IgXCJpbnZvaWNlXCInKTtcbiAgICBpZiAodGhpcy5yZWZlcmVuY2UpIHJldHVybiB0aGlzLnJlZmVyZW5jZTtcbiAgICByZXR1cm4gdGhpcy5zZXRSZWZlcmVuY2VGcm9tUGF0dGVybigodHlwZSA9PT0gJ29yZGVyJykgPyB0aGlzLm9yZGVyX3JlZmVyZW5jZV9wYXR0ZXJuIDogdGhpcy5pbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gU2V0IHJlZmVyZW5jZVxuICAgKiBAcGFyYW0gcGF0dGVyblxuICAgKiBAcmV0dXJuIHsqfVxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdG9kbyBvcHRpbWl6ZSBpdFxuICAgKi9cbiAgc2V0UmVmZXJlbmNlRnJvbVBhdHRlcm4ocGF0dGVybikge1xuICAgIGNvbnN0IHRtcCA9IHBhdHRlcm4uc3BsaXQoJyQnKS5zbGljZSgxKTtcbiAgICBsZXQgb3V0cHV0ID0gJyc7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHRtcCkge1xuICAgICAgaWYgKCFpdGVtLmVuZHNXaXRoKCd9JykpIHRocm93IG5ldyBFcnJvcignV3JvbmcgcGF0dGVybiB0eXBlJyk7XG4gICAgICBpZiAoaXRlbS5zdGFydHNXaXRoKCdwcmVmaXh7JykpIG91dHB1dCArPSBpdGVtLnJlcGxhY2UoJ3ByZWZpeHsnLCAnJykuc2xpY2UoMCwgLTEpO1xuICAgICAgZWxzZSBpZiAoaXRlbS5zdGFydHNXaXRoKCdzZXBhcmF0b3J7JykpIG91dHB1dCArPSBpdGVtLnJlcGxhY2UoJ3NlcGFyYXRvcnsnLCAnJykuc2xpY2UoMCwgLTEpO1xuICAgICAgZWxzZSBpZiAoaXRlbS5zdGFydHNXaXRoKCdkYXRleycpKSBvdXRwdXQgKz0gbW9tZW50KCkuZm9ybWF0KGl0ZW0ucmVwbGFjZSgnZGF0ZXsnLCAnJykuc2xpY2UoMCwgLTEpKTtcbiAgICAgIGVsc2UgaWYgKGl0ZW0uc3RhcnRzV2l0aCgnaWR7JykpIHtcbiAgICAgICAgY29uc3QgaWQgPSBpdGVtLnJlcGxhY2UoJ2lkeycsICcnKS5zbGljZSgwLCAtMSk7XG4gICAgICAgIGlmICghL15cXGQrJC8udGVzdChpZCkpIHRocm93IG5ldyBFcnJvcihgSWQgbXVzdCBiZSBhbiBpbnRlZ2VyICgke2lkfSlgKTtcbiAgICAgICAgb3V0cHV0ICs9ICh0aGlzLl9pZCkgPyB0aGlzLnBhZCh0aGlzLl9pZCwgaWQubGVuZ3RoKSA6IHRoaXMucGFkKDAsIGlkLmxlbmd0aCk7XG4gICAgICB9IGVsc2UgdGhyb3cgbmV3IEVycm9yKGAke2l0ZW19IHBhdHRlcm4gcmVmZXJlbmNlIHVua25vd25gKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gRXhwb3J0IG9iamVjdCB3aXRoIGh0bWwgY29udGVudCBhbmQgZXhwb3J0YXRpb24gZnVuY3Rpb25zXG4gICAqIEByZXR1cm5zIHt7aHRtbDogKiwgdG9GaWxlOiAoZnVuY3Rpb24oKik6ICopfX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF90b0hUTUwoa2V5cykge1xuICAgIGNvbnN0IGh0bWwgPSB0aGlzLl9jb21waWxlKGtleXMuZmlsZW5hbWUgPT09ICdvcmRlcicgPyB0aGlzLmdldE9yZGVyKCkgOiB0aGlzLmdldEludm9pY2UoKSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGh0bWwsXG4gICAgICB0b0ZpbGU6IChmaWxlcGF0aCkgPT4gdGhpcy5fdG9GaWxlRnJvbUhUTUwoaHRtbCwgKGZpbGVwYXRoKSB8fCBgJHtrZXlzLmZpbGVuYW1lfS5odG1sYCksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBjb250ZW50IHRvIHBkZiBmaWxlXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3RvUERGKGtleXMpIHtcbiAgICBjb25zdCBwZGYgPSBodG1sVG9QZGYuY3JlYXRlKHRoaXMuX3RvSFRNTChrZXlzKS5odG1sLCB7dGltZW91dDogJzkwMDAwJywgZm9ybWF0OiAnbGV0dGVyJ30pO1xuICAgIHJldHVybiB7XG4gICAgICBwZGYsXG4gICAgICB0b0ZpbGU6IChmaWxlcGF0aCkgPT4gdGhpcy5fdG9GaWxlRnJvbVBERihwZGYsIChmaWxlcGF0aCkgfHwgYCR7a2V5cy5maWxlbmFtZX0ucGRmYCksXG4gICAgICB0b0J1ZmZlcjogKCkgPT4gdGhpcy5fdG9CdWZmZXJGcm9tUERGKHBkZiksXG4gICAgICB0b1N0cmVhbTogKGZpbGVwYXRoKSA9PiB0aGlzLl90b1N0cmVhbUZyb21QREYocGRmLCAoZmlsZXBhdGgpIHx8IGAke2tleXMuZmlsZW5hbWV9LnBkZmApLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFNhdmUgY29udGVudCBpbnRvIGZpbGUgZnJvbSB0b0hUTUwoKSBtZXRob2RcbiAgICogQHBhcmFtIGNvbnRlbnRcbiAgICogQHBhcmFtIGZpbGVwYXRoXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3RvRmlsZUZyb21IVE1MKGNvbnRlbnQsIGZpbGVwYXRoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IGZzLndyaXRlRmlsZShmaWxlcGF0aCwgY29udGVudCwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikgcmVqZWN0KGVycik7XG4gICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gU2F2ZSBjb250ZW50IGludG8gZmlsZSBmcm9tIHRvUERGKCkgbWV0aG9kXG4gICAqIEBwYXJhbSBjb250ZW50XG4gICAqIEBwYXJhbSBmaWxlcGF0aFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF90b0ZpbGVGcm9tUERGKGNvbnRlbnQsIGZpbGVwYXRoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IGNvbnRlbnQudG9GaWxlKGZpbGVwYXRoLCAoZXJyLCByZXMpID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgIHJldHVybiByZXNvbHZlKHJlcyk7XG4gICAgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBFeHBvcnQgUERGIHRvIGJ1ZmZlclxuICAgKiBAcGFyYW0gY29udGVudFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF90b0J1ZmZlckZyb21QREYoY29udGVudCkge1xuICAgIHJldHVybiBjb250ZW50LnRvQnVmZmVyKChlcnIsIGJ1ZmZlcikgPT4ge1xuICAgICAgaWYgKGVycikgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgICByZXR1cm4gYnVmZmVyO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBFeHBvcnQgUERGIHRvIGZpbGUgdXNpbmcgc3RyZWFtXG4gICAqIEBwYXJhbSBjb250ZW50XG4gICAqIEBwYXJhbSBmaWxlcGF0aFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF90b1N0cmVhbUZyb21QREYoY29udGVudCwgZmlsZXBhdGgpIHtcbiAgICByZXR1cm4gY29udGVudC50b1N0cmVhbSgoZXJyLCBzdHJlYW0pID0+IHN0cmVhbS5waXBlKGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVwYXRoKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBDYWxjdWxhdGVzIG51bWJlciBvZiBwYWdlcyBhbmQgaXRlbXMgcGVyIHBhZ2VcbiAgICogQHJldHVybiB7e3Jvd3NfaW5fZmlyc3RfcGFnZTogbnVtYmVyLCByb3dzX2luX290aGVyc19wYWdlczogbnVtYmVyLCBsb29wX3RhYmxlOiBudW1iZXJ9fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3RlbXBsYXRlQ29uZmlndXJhdGlvbigpIHtcbiAgICBjb25zdCB0ZW1wbGF0ZV9yb3dzX3Blcl9wYWdlID0gMjk7XG4gICAgY29uc3QgdGVtcGxhdGVDb25maWcgPSB7XG4gICAgICByb3dzX2luX2ZpcnN0X3BhZ2U6ICh0aGlzLmFydGljbGUubGVuZ3RoID4gMTkpID8gdGVtcGxhdGVfcm93c19wZXJfcGFnZSA6IDE5LFxuICAgICAgcm93c19wZXJfcGFnZXM6IDQzLFxuICAgICAgcm93c19pbl9sYXN0X3BhZ2U6IDMzLFxuICAgIH07XG5cbiAgICBsZXQgbmJBcnRpY2xlcyA9IHRoaXMuYXJ0aWNsZS5sZW5ndGg7XG4gICAgbGV0IGxvb3AgPSAxO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBpZiAobG9vcCA9PT0gMSkge1xuICAgICAgICBuYkFydGljbGVzIC09IHRlbXBsYXRlQ29uZmlnLnJvd3NfaW5fZmlyc3RfcGFnZTtcbiAgICAgICAgaWYgKG5iQXJ0aWNsZXMgPD0gMCkge1xuICAgICAgICAgIHRlbXBsYXRlQ29uZmlnLmxvb3BfdGFibGUgPSAodGVtcGxhdGVDb25maWcucm93c19pbl9maXJzdF9wYWdlICE9PSB0ZW1wbGF0ZV9yb3dzX3Blcl9wYWdlKSA/IDEgOiAyO1xuICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZUNvbmZpZztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobG9vcCA+PSAyKSB7XG4gICAgICAgIGlmIChuYkFydGljbGVzIDw9IHRlbXBsYXRlQ29uZmlnLnJvd3NfaW5fbGFzdF9wYWdlKSB7XG4gICAgICAgICAgdGVtcGxhdGVDb25maWcubG9vcF90YWJsZSA9IGxvb3A7XG4gICAgICAgICAgcmV0dXJuIHRlbXBsYXRlQ29uZmlnO1xuICAgICAgICB9XG4gICAgICAgIG5iQXJ0aWNsZXMgLT0gdGVtcGxhdGVDb25maWcucm93c19wZXJfcGFnZXM7XG4gICAgICAgIGlmIChuYkFydGljbGVzIDw9IDApIHtcbiAgICAgICAgICB0ZW1wbGF0ZUNvbmZpZy5sb29wX3RhYmxlID0gbG9vcDtcbiAgICAgICAgICByZXR1cm4gdGVtcGxhdGVDb25maWc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxvb3AgKz0gMTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIE92ZXJyaWRlcyBpMThuIGNvbmZpZ3VyYXRpb25cbiAgICogQHBhcmFtIGNvbmZpZ1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2kxOG5Db25maWd1cmUoY29uZmlnKSB7XG4gICAgdGhpcy5fZGVmYXVsdExvY2FsZSA9IChjb25maWcgJiYgY29uZmlnLmRlZmF1bHRMb2NhbGUpID8gY29uZmlnLmRlZmF1bHRMb2NhbGUgOiAnZW4nO1xuICAgIHRoaXMuX2F2YWlsYWJsZUxvY2FsZSA9IChjb25maWcgJiYgY29uZmlnLmxvY2FsZXMpID8gY29uZmlnLmxvY2FsZXMgOiBbJ2VuJywgJ2ZyJ107XG4gICAgaWYgKGNvbmZpZykgaTE4bi5jb25maWd1cmUoY29uZmlnKTtcbiAgfVxufVxuIl19