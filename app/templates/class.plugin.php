<?php if (!defined('APPLICATION')) exit;

$<%= type %>Info['<%= directory %>'] = array(
    'Name'        => "<%= name %>",<% if (desc) { %>
    'Description' => "<%= desc %>",<% } %>
    'Version'     => '1.0.0',<% if (url) { %>
    'PluginUrl'   => '<%= url %>',<% } %>
    'Author'      => "<%= author.name %>",<% if (author.email) { %>
    'AuthorEmail' => '<%= author.email %>',<% } if (author.url) { %>
    'AuthorUrl'   => '<%= author.url %>',<% } %>
    'License'     => '<%= license %>'
);

/**
 * <%= name %> Plugin
 *
 * @author    <%= author.name %><% if (author.email) { %> <<%= author.email %>><% } %>
 * @copyright <%= year %> (c) <%= author.name %>
 * @license   <%= license %>
 * @since     1.0.0
 */
class <%= classname %>Plugin extends Gdn_Plugin {

}
