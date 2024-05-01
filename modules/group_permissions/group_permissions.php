<?php
class modules_group_permissions {
    /**
    * @brief The base URL to the depselect module.  This will be correct whether it is in the 
    * application modules directory or the xataface modules directory.
    *
    * @see getBaseURL()
    */
   private $baseURL = null;

   private $pathsRegistered = false;

   private $assignableRoles = null;

   public function __construct(){
       $app = Dataface_Application::getInstance();
       $tables = array(
           'xataface__groups',
           'xataface__group_members'
       );
       $dirpath = dirname(__FILE__);
       foreach ( $tables as $table){
           Dataface_Table::setBasePath($table, $dirpath);
           $app->_conf['_allowed_tables']['group perms '.$table] = $table;
       }

   }

   /**
    * @brief Returns the base URL to this module's directory.  Useful for including
    * Javascripts and CSS.
    *
    */
   public function getBaseURL(){
           if ( !isset($this->baseURL) ){
                   $this->baseURL = Dataface_ModuleTool::getInstance()->getModuleURL(__FILE__);
           }
           return $this->baseURL;
   }


   public function registerPaths(){
       if ( !$this->pathsRegistered ){
           $this->pathsRegistered = true;

           df_register_skin('group_permissions', dirname(__FILE__).'/templates');
           Dataface_JavascriptTool::getInstance()
               ->addPath(
                   dirname(__FILE__).'/js',
                   $this->getBaseURL().'/js'
               );

           Dataface_CSSTool::getInstance()
               ->addPath(
                   dirname(__FILE__).'/css',
                   $this->getBaseURL().'/css'
               );
       }
   }

   /**
    * @brief Returns an array of role names that are assignable using 
    * group permissions.  A role is considered assignable if it has the
    * __assignable__ permission.
    * 
    * Only assignable roles will appear in the user interface for 
    * managing user roles.
    * 
    * @param array $roles If array of role names is provided, this method
    *  is a setter.  Otherwise this method is a getter.
    * @return mixed If used as a setter, then this returns a reference to
    * self for chaining. Otherwise it returns an array of role names 
    * that are assignable using the group permissions module.  
    */
   public function assignableRoles(array $roles = null){
       if ( isset($roles) ){
           $this->assignableRoles = $roles;
           return $this;
       } else {
           if ( !isset($this->assignableRoles) ){
               $this->assignableRoles = array();
               $pt = Dataface_PermissionsTool::getInstance();
               foreach ( $pt->rolePermissions as $role=>$perms){
                   if ( @$perms['__assignable__'] ){
                       $this->assignableRoles[] = $role;
                   }
               }
           }
           return $this->assignableRoles;
       }

   }
   
   public function addRolesColumnToTable($table){
       $table = str_replace('`', '', $table);
       $sql = "alter table `".$table."` add column `__roles__` TEXT";
       df_q($sql);
       if ( function_exists('apc_clear_cache') ){
           apc_clear_cache('user');
       }
       df_clear_views();
       df_clear_cache();
       Dataface_IO::touchTable($table);
       
   }
}