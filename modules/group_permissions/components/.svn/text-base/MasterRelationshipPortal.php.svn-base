<?php
namespace xataface\modules\group_permissions\components;

class MasterRelationshipPortal {
    /**
     * @var \Dataface_Relationship
     */
    private $relationship;
    
    /**
     * @var string
     */
    private $columnName;
    
    /**
     * @var string[]
     */
    private $relatedColumns = array();
    
    public function __construct(\Dataface_Relationship $relationship, $columnName, array $relatedColumns){
        $this->relationship = $relationship;
        $this->columnName($columnName);
        $this->relatedColumns($relatedColumns);
    }
    
    
    public function columnName($columnName = null ){
        if ( isset($columnName) ){
            $this->columnName = $columnName;
            return $this;
        } else {
            return $this->columnName;
        }
    }
    
    public function columnLabel(){
        $table = $relationship->getTable();
        $field = $table->getField($this->columnName);
        return $field['widget']['label'];
    }
    
    public function relatedColumns(array $columnNames = null ){
        if ( isset($columnNames) ){
            $this->relatedColumns = array();
            foreach ( $columnNames as $cname){
                $this->relatedColumns[] = $this->relationship->getField($cname);
            }
            return $this;
        } else {
            return $this->relatedColumns;
        }
    }
    
    
    public function render(){
    
        \Dataface_ModuleTool::getInstance()->loadModule('modules_group_permissions')
            ->registerPaths();
    
        \Dataface_JavascriptTool::getInstance()->import(
            'xataface/modules/group_permissions/components/MasterRelationshipPortal.js'
        );
    
        df_display(array(
                'portal' => $this
            ),
            'xataface/modules/group_permissions/components/MasterRelationshipPortal.html'
        );
    }
    
}