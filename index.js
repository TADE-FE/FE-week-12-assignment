$(document).ready(function() {
    const apiURL = 'http://localhost:3000/entities';

    function loadEntities() {
        $.ajax({
            url: apiURL,
            method: 'GET',
            success: function(data) {
                $('#entities').empty();
                data.forEach(entity => {
                    $('#entities').append(
                        `<div class="entity list-group-item d-flex justify-content-between align-items-center" data-id="${entity.id}">
                            <div>
                                <span><strong>${entity.name}</strong>: ${entity.description}</span>
                            </div>
                            <div>
                                <button class="edit-btn btn btn-secondary btn-sm mr-2">Edit</button>
                                <button class="delete-btn btn btn-danger btn-sm">Delete</button>
                            </div>
                        </div>`
                    );
                });
                updateTotalValue();
            },
            error: function() {
                alert('Failed to load entities.');
            }
        });
    }
    loadEntities();

    $('#entity-form').submit(function(e) {
        e.preventDefault();
        const entityName = $('#entity-name').val();
        const entityDescription = $('#entity-description').val();
        $.ajax({
            url: apiURL,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ name: entityName, description: entityDescription }),
            success: function() {
                $('#entity-name').val('');
                $('#entity-description').val('');
                loadEntities();
            },
            error: function() {
                alert('Failed to add entity.');
            }
        });
    });

    $('#entities').on('click', '.delete-btn', function() {
        const entityId = $(this).closest('.entity').data('id');
        $.ajax({
            url: `${apiURL}/${entityId}`,
            method: 'DELETE',
            success: function() {
                loadEntities();
            },
            error: function() {
                alert('Failed to delete entity.');
            }
        });
    });

    $('#entities').on('click', '.edit-btn', function() {
        const entityId = $(this).closest('.entity').data('id');
        const newName = prompt("Enter new unit:");
        const newDescription = prompt("Enter new points value:");
        if (newName && newDescription) {
            $.ajax({
                url: `${apiURL}/${entityId}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({ name: newName, description: newDescription }),
                success: function() {
                    loadEntities();
                },
                error: function() {
                    alert('Failed to edit entity.');
                }
            });
        }
    });

    function updateTotalValue() {
        let totalValue = 0;
        $('.entity').each(function() {
            const description =$(this).find('div').first().text().split(': ')[1];
            const value = parseFloat(description);
            if (!isNaN(value)) {
                totalValue += value;
            }
        });
        $('#total-value').text(totalValue);
    }
});
