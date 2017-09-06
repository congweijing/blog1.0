var $table = $("#articles"),
    $remove = $("#remove"),
    selections = [];

$(function () {
    $("#articleManage  a").addClass("active");
    $table.bootstrapTable({
        url: "/admin/getArticles",
        method: "post",
        pagination: true,          //是否分页
        queryParamsType: "pageIndex",
        sidePagination: "server",
        pageList: [10, 25, 50, 100, "All"],
        cache:false,
        toolbar: "#toolbar",
        iconsPrefix: "fa",
        idField: "UniqueId",
        sortName: "CreateTime",
        sortOrder: "desc",
        filterControl: true,
        responseHandler: responseHandler,  //闹到数据后的操作
        columns: [{
            field: "CateName",
            title: "分类",
            halign: "center",
            valign: "middle",
            width: "140px",
            filterControl: "select",
            filterData: "url:/admin/getCateFilter"
            /*formatter: function (value, row) {   //列操作
                if (row.CategoryId) {
                    return "<a href=\"/blog/" + row.CategoryAlias + "\" target=\"_blank\">" + value + "</a>";
                }
            }*/
        }, {
            field: "UniqueId",
            title: "ID",
            align: "center",
            valign: "middle",
            width: "180px",
            //filterControl: "input",
            visible: false
        }, {
            field: "Title",
            title: "标题",
            halign: "center",
            valign: "middle",
            formatter: function (value, row) {
                var link = row.IsDraft ? '<span class="label label-primary" title="这是一篇草稿">草稿</span> ' : '';
                if (row.Source === '1') {
                    link += "<a href=\"" + row.Url + "\" target=\"_blank\"><i class=\"fa fa-link\"></i> " + value + "</a>";
                } else {
                    if (row.CategoryAlias) {
                        link += "<a href=\"/blog/" + row.CategoryAlias + "/" + row.Alias + "\" target=\"_blank\">" + value + "</a>";
                    }
                }
                return link;
            },
            filterControl: "input"
        }, {
            field: "CreateTime",
            title: "发布时间",
            align: "center",
            valign: "middle",
            width: "180px",
        }, {
            field: "ModifyTime",
            title: "修改时间",
            align: "center",
            valign: "middle",
            width: "180px",
        }, {
            field: "ViewCount",
            title: "浏览次数",
            align: "center",
            valign: "middle",
            width: "120px",
            formatter: function (value, row) {
                if (row.Source == 1) {
                    return "-";
                } else {
                    return value;
                }
            }
        }, {
            field: "operate",
            title: "操作",
            align: "center",
            valign: "middle",
            width: "120px",
            events: {
                "click .remove": function (e, value, row, index) {
                    deleteArticle(row.UniqueId);
                }
            },
            formatter: function (value, row) {
                return "<a class=\"edit btn btn-white\" title=\"编辑\" href=\"/admin/editarticle/" + row.UniqueId + "\"><i class=\"fa fa-pencil\"></i></a> "
                    + "<button type=\"button\" class=\"remove btn btn-white\" title=\"删除\"><i class=\"fa fa-trash-o\"></i></button>";
            
            }
        }]
    });
});
//////////删除文章
function deleteArticle(id) {
    $.ajax({
        url: "/admin/deleteArticle",
        type: "post",
        data: "id=" + id,
        complete: function () {
            selections = [];
            $table.bootstrapTable('selectPage', 1);
            alert("删除成功");

        }
    });
}


function responseHandler(res) {
    $.each(res.rows, function (i, row) {
        row.state = $.inArray(row.UniqueId, selections) !== -1;
    });
    return res;
}