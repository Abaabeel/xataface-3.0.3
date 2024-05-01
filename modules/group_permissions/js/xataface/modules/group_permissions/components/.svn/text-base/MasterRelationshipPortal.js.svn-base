//require <jquery.packed.js>
//require <xataface/view/TableView.js>
//require <xataface/model/ListModel.js>
//require <xataface/store/ResultSet.js>
(function(){
    var $ = jQuery;
    var TableView = xataface.view.TableView;
    var ListModel = xataface.model.ListModel;
    var ResultSet = xataface.store.ResultSet;
    
    var pkg = XataJax.load('xataface.modules.group_permissions.components');
    pkg.MasterRelationshipPortal = MasterRelationshipPortal;
    
    function MasterRelationshipPortal(o){
        this.el = o.el;
        this.masterTableName = o.masterTableName;
        this.relationshipName = o.relationshipName;
        this.masterTableColumn = o.masterTableColumn;
        this.relatedColumnNames = o.relatedColumnNames;
        
        this.masterListModel = new ListModel();
        this.masterListView = new TableView({
            model : this.masterListModel,
            el : $('table.search-results', this.el).get(0)
        });
        this.masterListResultSet = new ResultSet({
            model : this.masterListModel,
            query : {
                '-table' : this.masterTableName,
                '-action' : 'export_json',
                '--fields' : [this.masterTableColumn]
            }
        });
        
        this.relatedListModel = new ListModel();
        this.relatedListView = new TableView({
            model : this.relatedListModel,
            el : $('table.relationship-results', this.el).get(0)
        });
        this.relatedListResultSet = new ResultSet({
            model : this.relatedListModel
        });
        
    }
    
    (function(){
        $.extend(MasterRelationshipPortal.prototype, {
            el : null,
            masterListModel : null,
            masterListView : null,
            masterListResultSet : null,
            relatedListModel : null,
            relatedListView : null,
            relatedListResultSet : null,
            
            masterTableName : null,
            relationshipName : null,
            masterTableColumn : null,
            relatedColumnNames : null
            
        });
    })();
    
    
    registerXatafaceDecorator(function(el){
        $('div.master-relationship-portal', el).each(function(){
            var portal = new MasterRelationshipPortal({
                el : this,
                masterTableName : $(this).attr('data-master-table-name'),
                relationshipName : $(this).attr('data-relationship-name'),
                masterTableColumn : $(this).attr('data-master-table-column'),
                relatedColumnNames : $(this).attr('data-related-columns').replace('  ',' ').split(' ')
            });
        });
    });
})();