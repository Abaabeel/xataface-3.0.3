<?php
/**
 * This template is used by the fmpxmlresult action.  It produces output
 * compatible with Filemaker. 
 * @author Steve Hannah <steve@weblite.ca>
 * @created March 3, 2008 
 * @copyright 2008 Steve Hannah, All rights reserved.
 */
?><?php echo '<?xml version="1.0" encoding="UTF-8"?>'."\n";?>
<FMPXMLRESULT xmlns="//www.filemaker.com/fmpxmlresult">
	<ERRORCODE>0</ERRORCODE>
	<PRODUCT BUILD="2008-01-01" NAME="Xataface" VERSION="1.0" />
	<DATABASE DATEFORMAT="yyyy-mm-dd" LAYOUT="summary" NAME="<?php echo $this->_($query['-table']);?>" RECORDS="<?php echo $this->_($results->cardinality());?>" TIMEFORMAT="kk:mm:ss" />
	<METADATA>

		<?php foreach ( $this->fields() as $field ): 
			
			$emptyOK = @$field['validators']['required'] ? 'NO':'YES';
			$maxRepeat = "1";
			$name = $field['Field'];
			$type = $this->getType($field);
			?>
			<FIELD EMPTYOK="<?php echo $this->_($emptyOK);?>" MAXREPEAT="<?php echo $this->_($maxRepeat);?>" NAME="<?php echo $this->_($name);?>" TYPE="<?php echo $this->_($type);?>" />	

		<?php endforeach;?>

	</METADATA>
	<RESULTSET FOUND="<?php echo $results->found();?>">
		<?php 
		$results->loadSet('',false,false,false);
		$iterator =& $results->iterator();
		while ($iterator->hasNext()):
			$row =& $iterator->next();
		?>
			<ROW MODID="1" RECORDID="<?php echo $this->_($this->getRecordId($row));?>">
				<?php foreach ( $this->fields() as $field):?>
					<COL>
						<DATA><?php echo $this->_($row->display($field['Field']));?></DATA>
					</COL>
				<?php endforeach;?>
			</ROW>
		<?php endwhile;?>
	
	</RESULTSET>
</FMPXMLRESULT>