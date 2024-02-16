package db

import ("database/sql"
"fmt")




func ExecQuery(query string, args ...interface{}) (sql.Result, error) {
    // Prepare the SQL statement to ensure that our SQL query is safe before executing it.
    db := GetDB()
    stmt, err := db.Prepare(query)
    if err != nil {
        return nil, fmt.Errorf("error preparing query: %w", err)
    }
    defer stmt.Close()

    // Execute the SQL statement with variable parameters.
    result, err := stmt.Exec(args...)
    if err != nil {
        return nil, fmt.Errorf("error executing query: %w", err)
    }

    return result, nil
}