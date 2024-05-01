//require <jquery.packed.js>
(function(){

	var $ = jQuery;
	
	
	if ( typeof(xataface) == 'undefined' ) xataface = {};
	if ( typeof(xataface.modules) == 'undefined' ) xataface.modules = {};
	if ( typeof(xataface.modules.pdfreports ) == 'undefined' ) xataface.modules.pdfreports = {};
	
	xataface.modules.pdfreports.DataSchema = DataSchema;
	
	
	/**
	 * @name DataSchema
	 * @memberOf xataface.modules.pdfreports
	 * @class
	 * @constructor
	 *
	 * @description Encapsulates a schema (or a node of a schema) in a datasource.
	 *
	 * @param {Object} o Configuration parameters
	 *
	 * @param {String} o.name The name of this node
	 * @param {String} o.label The label of this node (optional)
	 * @param {String} o.description The description of this node (optional)
	 * @param {String} o.macro The macro of this node (optional -- will be generated otherwise).
	 * @param {boolean} o.isField True if this schema represents a field.
	 * @param {boolean} o.isSchema True if this schema represents a schema.
	 * @param {boolean} o.isFunction True if this schema represents a function.
	 * @param {xataface.modules.pdfreports.DataSchema} o.parentSchema The parent schema of this one.
	 *
	 * @property {String} name The name of this node.
	 * @property {String} description A description of this node.
	 * @property {String} label The label for this schema.
	 * @property {String} macro The macro for this schema (this is what is placed into a template
	 *		to indicate that the template wants to refer to this node of the schema.
	 * @property {boolean} isField Marks whether this node represents a scalar field.
	 * @property {boolean} isSchema Marks whether this node represents a schema.
	 * @property {boolean} isFunction Marks whether this node represents a function or expression.
	 * @property {xataface.modules.pdfreports.DataSchema} parentSchema The parent schema of this schema.
	 */
	function DataSchema(/*Object*/ o){
		if ( typeof(o) == 'undefined' ) o = {};
		
		this.subSchemas = [];
		this.parentSchema = null;
		this.name = null;
		this.label = null;
		this.description = null;
		this.macro = null;
		this.isField = false;
		this.isSchema = false;
		this.isFunction = false;
		
		$.extend(this,o);
		
		
	}	
	
	
	DataSchema.prototype.getPath = getPath;
	DataSchema.prototype.getLabel = getLabel;
	DataSchema.prototype.getMacro = getMacro;
	DataSchema.prototype.serialize = serialize;
	DataSchema.prototype.unserialize = unserialize;
	DataSchema.prototype.getFields = getFields;
	DataSchema.prototype.getSubSchemas = getSubSchemas;
	DataSchema.prototype.getFunctions = getFunctions;
	DataSchema.prototype.add = add;
	
	DataSchema.prefix = 'data-xf-schema-';
	DataSchema.serializableFields = [
			'name',
			'label',
			'description',
			'macro',
			'isField',
			'isSchema',
			'isFunction'
		
		];
	
	/**
	 * @description Gets the path to this node.
	 * @name getPath
	 * @memberOf xataface.modules.pdfreports.DataSchema#
	 * @function
	 *
	 * @param {String} sep The separator used to separate each path component.  Default is '.'
	 * @returns {String} The path to this node.
	 */
	function getPath(sep){
		if ( typeof(sep) == 'undefined' ) sep = '.';
		
		var path = '';
		
		if ( this.parentSchema ){
			path = this.parentSchema.getPath(sep);
		}
		
		if ( !path ) sep = '';
		
		if ( this.name ){
			path += sep + this.name;
		}
		return path;
	}
	
	
	/**
	 * @description Gets the label of this node.  If the label is not set, this will
	 * fall back to return the name.
	 * @name getLabel
	 * @memberOf xataface.modules.pdfreports.DataSchema#
	 * @function
	 *
	 * @returns {String} 
	 */
	function getLabel(){
		return this.label || this.name;
	}
	
	/**
	 * @description Returns the description of this node.
	 * @name getDescription
	 * @memberOf xataface.modules.pdfreports.DataSchema#
	 * @function
	 * @returns {String}
	 */
	function getDescription(){
		return this.description || '';
	}
	
	/**
	 * @description Gets the macro for this node.  The macro is the text that is 
	 * inserted into templates as a reference to this node.  It is generally
	 * a string like \{$nodepath\}.
	 * @name getMacro
	 * @memberOf xataface.modules.pdfreports.DataSchema#
	 * @function
	 * 
	 * @returns {String}
	 */
	function getMacro(){
		if ( this.macro ) return this.macro;
		if ( this.isField ) return '{$'+this.getPath()+'}';
		else if ( this.isFunction && this.parentSchema && this.parentSchema.isField ){
			return '{@'+this.name+'('+this.parentSchema.getPath()+')}';
		}
		else return null;
	}
	
	
	/**
	 * @description Unserializes the schema to DOM element for storage and later 
	 * reloading.
	 *
	 * @name unserialize
	 * @memberOf xataface.modules.pdfreports.DataSchema#
	 * @function
	 *
	 * @param {HTMLElement} el The DOM element from which the schema is unserialized.
	 * @returns {void}
	 */
	function unserialize(/*HTMLElement*/ el){
		var p = DataSchema.prefix;
		
		var atts = DataSchema.serializableFields;
		var self = this;
		$.each(atts, function(){
			var val = $(el).attr(p+this);
			if ( val == 'false' ) self[this] = false;
			else if ( val == 'true' ) self[this] = true;
			else if ( val == 'null' ) self[this] = null;
			else self[this] = val;
			
		});
		
		this.subSchemas = [];
		$(el).children().each(function(){
			var subSchema = new DataSchema({
				parentSchema: self
			});
			subSchema.unserialize(this);
			self.subSchemas.push(subSchema);
		});
		
		
		
	}
	
	/**
	 * @description serializes The schema and returns a DOM element of it.
	 * @name serialize
	 * @memberOf xataface.modules.pdfreports.DataSchema#
	 * @function
	 *
	 * @returns {HTMLElement}
	 */
	function serialize(){
		var p = DataSchema.prefix;
		var atts = DataSchema.serializableFields;
		var out = $('<div>')
			.addClass('xf-DataSchema-Schema')
			.get(0);
			
		var self = this;
		
		$.each(atts, function(){
			$(out).attr(p+this, self[this]);
		});
		
		$.each(this.subSchemas, function(){
			$(out).append(this.serialize());
		});
		
		return out;
		
		
		
	}
	
	/**
	 * @description Gets the child schemas of this one that represent fields.
	 * @name getFields
	 * @memberOf xataface.modules.pdfreports.DataSchema#
	 * @function
	 *
	 * @returns {xataface.modules.pdfreports.DataSchema[]}
	 */
	function getFields(){
	
		var out = [];
		$.each(this.subSchemas, function(){
			if ( this.isField ) out.push(this);
		});
		return out;
	}
	
	/**
	 * @description Gets the child schemas of this one that represent schemas.
	 * @name getSubSchemas
	 * @memberOf xataface.modules.pdfreports.DataSchema#
	 * @function
	 *
	 * @returns {xataface.modules.pdfreports.DataSchema[]}
	 */
	function getSubSchemas(){
		var out = [];
		$.each(this.subSchemas, function(){
			if ( this.isSchema ) out.push(this);
		});
		
		return out;
	}
	
	
	/**
	 * @description Gets the child schemas of this one that represent functions.
	 * @name getFunctions
	 * @memberOf xataface.modules.pdfreports.DataSchema#
	 * @function
	 *
	 * @returns {xataface.modules.pdfreports.DataSchema[]}
	 */
	function getFunctions(){
		var out = [];
		$.each(this.subSchemas, function(){
			if ( this.isFunction ) out.push(this);
		});
		
		return out;
	}
	
	/**
	 * @description Adds a child schema to this schema.
	 * @name add
	 * @memberOf xataface.modules.pdfreports.DataSchema#
	 * @function
	 * @param {xataface.modules.pdfreports.DataSchema} schema The schema to add
	 * @returns {boolean} True if the schema was added successfully.  False otherwise.
	 */
	function add(/*DataSchema*/ schema){
	
		var idx = this.subSchemas.indexOf(schema);
		if ( idx < 0 ){
			this.subSchemas.push(schema);
			schema.parentSchema = this;
			return true;
		}
		return false;
	}
	
	
	
	
	

})();