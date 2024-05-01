<?php
/*
 * Xataface Translation Memory Module
 * Copyright (C) 2011  Steve Hannah <steve@weblite.ca>
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 * 
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 * 
 * You should have received a copy of the GNU Library General Public
 * License along with this library; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin St, Fifth Floor,
 * Boston, MA  02110-1301, USA.
 *
 */
 
/**
 * @brief Utility class to perform useful functions for the translation memory.
 * @author Steve Hannah <steve@weblite.ca>
 */
class TMTools {

	
	/**
	 * @brief Normalizes a string for insertion or comparison with the translation
	 * memory.
	 *
	 * @param string $str The string to be normalized.
	 * @return string The normalized string.
	 */
	public static function normalize($str){
	
		mb_regex_encoding('UTF-8');
		return trim(mb_ereg_replace('\s+', ' ', $str));
	}
}