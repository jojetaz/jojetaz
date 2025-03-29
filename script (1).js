document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let activeWindow = null;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let currentTheme = 'windows'; // Tema por defecto
    
    // Actualizar la hora en la barra de tareas
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        
        // Formato de 12 horas
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // La hora '0' debe ser '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        const timeString = hours + ':' + minutes + ' ' + ampm;
        document.querySelector('.time').textContent = timeString;
    }
    
    // Actualizar la hora cada minuto
    updateClock();
    setInterval(updateClock, 60000);
    
    // Función para activar una ventana
    function activateWindow(windowId) {
        // Desactivar la ventana activa actual
        if (activeWindow) {
            activeWindow.classList.remove('active');
            const taskbarItem = document.querySelector(`.taskbar-item[data-window="${activeWindow.id}"]`);
            if (taskbarItem) taskbarItem.classList.remove('active');
        }
        
        // Activar la nueva ventana
        const newActiveWindow = document.getElementById(windowId);
        if (newActiveWindow) {
            newActiveWindow.classList.add('active');
            newActiveWindow.style.zIndex = 10;
            activeWindow = newActiveWindow;
            
            // Actualizar la barra de tareas
            const taskbarItem = document.querySelector(`.taskbar-item[data-window="${windowId}"]`);
            if (taskbarItem) {
                taskbarItem.classList.add('active');
            } else {
                // Crear un nuevo elemento en la barra de tareas si no existe
                createTaskbarItem(windowId);
            }
        }
    }
    
    // Función para crear un elemento en la barra de tareas
    function createTaskbarItem(windowId) {
        const window = document.getElementById(windowId);
        if (!window) return;
        
        const taskbarItems = document.querySelector('.taskbar-items');
        const taskbarItem = document.createElement('div');
        taskbarItem.classList.add('taskbar-item', 'active');
        taskbarItem.setAttribute('data-window', windowId);
        
        // Obtener el título de la ventana
        const windowTitle = window.querySelector('.window-title').textContent;
        
        // Obtener el icono correspondiente
        const iconSrc = getIconForWindow(windowId);
        
        taskbarItem.innerHTML = `
            <img src="${iconSrc}" alt="${windowTitle}">
            <span>${windowTitle}</span>
        `;
        
        taskbarItem.addEventListener('click', function() {
            const targetWindow = document.getElementById(windowId);
            if (targetWindow.classList.contains('active')) {
                targetWindow.classList.remove('active');
                this.classList.remove('active');
            } else {
                activateWindow(windowId);
            }
        });
        
        taskbarItems.appendChild(taskbarItem);
    }
    
    // Función para obtener el icono correspondiente a una ventana
    function getIconForWindow(windowId) {
        switch(windowId) {
            case 'file-explorer':
                return 'icons/folder.png';
            case 'browser':
                return 'icons/browser.png';
            case 'notepad':
                return 'icons/notepad.png';
            case 'calculator':
                return 'icons/calculator.png';
            case 'settings':
                return 'icons/settings.png';
            case 'word':
                return 'icons/office/word.png';
            case 'excel':
                return 'icons/office/excel.png';
            case 'powerpoint':
                return 'icons/office/powerpoint.png';
            default:
                return 'icons/app.png';
        }
    }
    
    // Manejar clics en los iconos del escritorio
    const desktopIcons = document.querySelectorAll('.icon');
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const windowId = this.getAttribute('data-window');
            activateWindow(windowId);
        });
    });
    
    // Manejar clics en los elementos del menú de inicio
    const startMenuItems = document.querySelectorAll('.start-menu-item');
    startMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            const appName = this.querySelector('span').textContent.toLowerCase();
            let windowId;
            
            switch(appName) {
                case 'archivos':
                    windowId = 'file-explorer';
                    break;
                case 'navegador':
                    windowId = 'browser';
                    break;
                case 'bloc de notas':
                    windowId = 'notepad';
                    break;
                case 'calculadora':
                    windowId = 'calculator';
                    break;
                case 'word':
                    windowId = 'word';
                    break;
                case 'excel':
                    windowId = 'excel';
                    break;
                case 'powerpoint':
                    windowId = 'powerpoint';
                    break;
                case 'configuración':
                    windowId = 'settings';
                    break;
                case 'apagar':
                    // Simular apagado
                    document.body.innerHTML = '<div style="height: 100vh; display: flex; align-items: center; justify-content: center; background-color: black; color: white; font-size: 24px;">Sistema apagado</div>';
                    return;
                default:
                    return;
            }
            
            activateWindow(windowId);
            document.querySelector('.start-menu').classList.remove('active');
        });
    });
    
    // Manejar el botón de inicio
    const startButton = document.querySelector('.start-button');
    startButton.addEventListener('click', function() {
        document.querySelector('.start-menu').classList.toggle('active');
    });
    
    // Cerrar el menú de inicio al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.start-menu') && !e.target.closest('.start-button')) {
            document.querySelector('.start-menu').classList.remove('active');
        }
    });
    
    // Manejar los controles de las ventanas (minimizar, maximizar, cerrar)
    const windowControls = document.querySelectorAll('.window-controls span');
    windowControls.forEach(control => {
        control.addEventListener('click', function() {
            const window = this.closest('.window');
            
            if (this.classList.contains('minimize')) {
                window.classList.remove('active');
                const taskbarItem = document.querySelector(`.taskbar-item[data-window="${window.id}"]`);
                if (taskbarItem) taskbarItem.classList.remove('active');
            } else if (this.classList.contains('maximize')) {
                if (window.style.width === '100vw') {
                    // Restaurar tamaño
                    window.style.width = '600px';
                    window.style.height = '400px';
                    window.style.top = '100px';
                    window.style.left = '100px';
                } else {
                    // Maximizar
                    window.style.width = '100vw';
                    window.style.height = 'calc(100vh - 40px)';
                    window.style.top = '0';
                    window.style.left = '0';
                }
            } else if (this.classList.contains('close')) {
                window.classList.remove('active');
                const taskbarItem = document.querySelector(`.taskbar-item[data-window="${window.id}"]`);
                if (taskbarItem) taskbarItem.remove();
            }
        });
    });
    
    // Hacer las ventanas arrastrables
    const windowHeaders = document.querySelectorAll('.window-header');
    windowHeaders.forEach(header => {
        header.addEventListener('mousedown', function(e) {
            if (e.target.closest('.window-controls')) return;
            
            const window = this.closest('.window');
            activateWindow(window.id);
            
            isDragging = true;
            dragOffsetX = e.clientX - window.getBoundingClientRect().left;
            dragOffsetY = e.clientY - window.getBoundingClientRect().top;
            
            window.classList.add('dragging');
        });
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging || !activeWindow) return;
        
        const newX = e.clientX - dragOffsetX;
        const newY = e.clientY - dragOffsetY;
        
        // Evitar que la ventana salga de los límites
        const maxX = window.innerWidth - activeWindow.offsetWidth;
        const maxY = window.innerHeight - activeWindow.offsetHeight - 40; // 40px para la barra de tareas
        
        activeWindow.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
        activeWindow.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
    });
    
    document.addEventListener('mouseup', function() {
        if (isDragging && activeWindow) {
            activeWindow.classList.remove('dragging');
            isDragging = false;
        }
    });
    
    // Implementar funcionalidad básica de la calculadora
    const calculatorButtons = document.querySelectorAll('.calc-btn');
    const calculatorDisplay = document.querySelector('.calculator-display');
    let currentCalculation = '0';
    let shouldResetDisplay = false;
    
    calculatorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.textContent;
            
            if (this.classList.contains('clear')) {
                currentCalculation = '0';
                calculatorDisplay.textContent = '0';
                return;
            }
            
            if (shouldResetDisplay) {
                currentCalculation = '0';
                shouldResetDisplay = false;
            }
            
            if (value === '=') {
                try {
                    // Reemplazar símbolos de operación por sus equivalentes en JavaScript
                    let calculation = currentCalculation
                        .replace(/×/g, '*')
                        .replace(/÷/g, '/');
                    
                    const result = eval(calculation);
                    calculatorDisplay.textContent = result;
                    currentCalculation = result.toString();
                    shouldResetDisplay = true;
                } catch (error) {
                    calculatorDisplay.textContent = 'Error';
                    currentCalculation = '0';
                    shouldResetDisplay = true;
                }
                return;
            }
            
            if (currentCalculation === '0' && !'.+-×÷'.includes(value)) {
                currentCalculation = value;
            } else {
                currentCalculation += value;
            }
            
            calculatorDisplay.textContent = currentCalculation;
        });
    });
    
    // Función para cambiar el tema del sistema
    function changeTheme(theme) {
        // Actualizar la variable global del tema actual
        currentTheme = theme;
        
        // Cambiar la hoja de estilo del tema
        const themeStylesheet = document.getElementById('theme-stylesheet');
        themeStylesheet.href = `themes/${theme}.css`;
        
        // Cambiar el fondo de pantalla
        document.querySelector('.desktop').style.backgroundImage = `url('wallpaper-${theme}.jpg')`;
        
        // Marcar el tema seleccionado como activo
        document.querySelectorAll('.theme-option').forEach(option => {
            if (option.getAttribute('data-theme') === theme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // Guardar la preferencia del usuario en localStorage
        localStorage.setItem('os-simulation-theme', theme);
    }
    
    // Manejar los botones de selección de tema
    const themeButtons = document.querySelectorAll('.theme-select-btn');
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            changeTheme(theme);
        });
    });
    
    // Cargar el tema guardado si existe
    const savedTheme = localStorage.getItem('os-simulation-theme');
    if (savedTheme) {
        changeTheme(savedTheme);
    } else {
        // Marcar el tema Windows como activo por defecto
        document.querySelector('.theme-option[data-theme="windows"]').classList.add('active');
    }
    
    // Crear iconos para el sistema
    function createIcons() {
        const iconFolder = '/home/computeruse/os-simulation/icons';
        // Esta función simula la creación de iconos, en un entorno real
        // descargaríamos o crearíamos los iconos reales
        console.log('Iconos simulados creados en:', iconFolder);
    }
    
    createIcons();
    
    // Funcionalidad para Word
    const wordPage = document.querySelector('.word-page');
    if (wordPage) {
        // Contador de palabras
        wordPage.addEventListener('input', function() {
            const text = this.textContent.trim();
            const wordCount = text ? text.split(/\s+/).length : 0;
            const statusBar = this.closest('.window').querySelector('.status-bar');
            if (statusBar) {
                statusBar.querySelector('span:nth-child(2)').textContent = `Palabras: ${wordCount}`;
            }
        });
        
        // Botones de formato
        const boldBtn = document.querySelector('#word .bold');
        const italicBtn = document.querySelector('#word .italic');
        const underlineBtn = document.querySelector('#word .underline');
        const alignLeftBtn = document.querySelector('#word .align-left');
        const alignCenterBtn = document.querySelector('#word .align-center');
        const alignRightBtn = document.querySelector('#word .align-right');
        
        if (boldBtn) boldBtn.addEventListener('click', () => document.execCommand('bold'));
        if (italicBtn) italicBtn.addEventListener('click', () => document.execCommand('italic'));
        if (underlineBtn) underlineBtn.addEventListener('click', () => document.execCommand('underline'));
        if (alignLeftBtn) alignLeftBtn.addEventListener('click', () => document.execCommand('justifyLeft'));
        if (alignCenterBtn) alignCenterBtn.addEventListener('click', () => document.execCommand('justifyCenter'));
        if (alignRightBtn) alignRightBtn.addEventListener('click', () => document.execCommand('justifyRight'));
        
        // Cambio de fuente y tamaño
        const fontFamily = document.querySelector('#word .font-family');
        const fontSize = document.querySelector('#word .font-size');
        
        if (fontFamily) {
            fontFamily.addEventListener('change', function() {
                document.execCommand('fontName', false, this.value);
            });
        }
        
        if (fontSize) {
            fontSize.addEventListener('change', function() {
                document.execCommand('fontSize', false, this.value);
            });
        }
    }
    
    // Funcionalidad para Excel
    const excelCells = document.querySelectorAll('.excel-cell');
    let cellValues = {}; // Almacena los valores de las celdas
    let cellFormulas = {}; // Almacena las fórmulas de las celdas
    
    if (excelCells.length > 0) {
        // Inicializar la estructura de datos para las celdas
        excelCells.forEach(cell => {
            const row = cell.parentElement.querySelector('.excel-row-header').textContent;
            const colIndex = Array.from(cell.parentElement.children).indexOf(cell);
            const col = document.querySelectorAll('.excel-header-cell')[colIndex].textContent;
            const cellId = `${col}${row}`;
            cellValues[cellId] = '';
            cellFormulas[cellId] = '';
        });
        
        // Función para obtener el valor de una celda por su ID
        function getCellValue(cellId) {
            return cellValues[cellId] || 0;
        }
        
        // Función para evaluar una fórmula
        function evaluateFormula(formula) {
            // Verificar si la fórmula contiene funciones de Excel
            const excelFunctions = {
                'SUM': (range) => {
                    return sumRange(range);
                },
                'AVERAGE': (range) => {
                    const sum = sumRange(range);
                    const count = countRange(range);
                    return count > 0 ? sum / count : 0;
                },
                'MAX': (range) => {
                    return Math.max(...getRangeValues(range));
                },
                'MIN': (range) => {
                    return Math.min(...getRangeValues(range));
                },
                'COUNT': (range) => {
                    return countRange(range);
                },
                'IF': (condition, trueValue, falseValue) => {
                    return eval(condition) ? trueValue : falseValue;
                },
                'POWER': (base, exponent) => {
                    return Math.pow(parseFloat(base), parseFloat(exponent));
                },
                'SQRT': (value) => {
                    return Math.sqrt(parseFloat(value));
                },
                'ROUND': (value, decimals) => {
                    return parseFloat(value).toFixed(parseInt(decimals));
                },
                'ABS': (value) => {
                    return Math.abs(parseFloat(value));
                },
                'PI': () => {
                    return Math.PI;
                },
                'SIN': (angle) => {
                    return Math.sin(parseFloat(angle));
                },
                'COS': (angle) => {
                    return Math.cos(parseFloat(angle));
                },
                'TAN': (angle) => {
                    return Math.tan(parseFloat(angle));
                },
                'LOG': (value) => {
                    return Math.log10(parseFloat(value));
                },
                'LN': (value) => {
                    return Math.log(parseFloat(value));
                }
            };
            
            // Buscar funciones de Excel en la fórmula
            for (const [funcName, funcImpl] of Object.entries(excelFunctions)) {
                const regex = new RegExp(`${funcName}\\(([^)]+)\\)`, 'gi');
                let match;
                
                while ((match = regex.exec(formula)) !== null) {
                    const fullMatch = match[0];
                    const args = match[1].split(',').map(arg => {
                        // Evaluar cada argumento recursivamente
                        if (arg.includes(':')) {
                            // Es un rango de celdas
                            return arg.trim();
                        } else if (/[A-G][1-5]/.test(arg)) {
                            // Es una referencia a una celda
                            return getCellValue(arg.trim());
                        } else {
                            // Es un valor o una expresión
                            try {
                                return eval(arg.trim());
                            } catch (e) {
                                return arg.trim();
                            }
                        }
                    });
                    
                    // Ejecutar la función con los argumentos procesados
                    let result;
                    try {
                        result = funcImpl(...args);
                    } catch (error) {
                        console.error(`Error en función ${funcName}:`, error);
                        result = '#ERROR';
                    }
                    
                    // Reemplazar la función en la fórmula original
                    formula = formula.replace(fullMatch, result);
                }
            }
            
            // Reemplazar referencias de celdas (ej. A1, B2) con sus valores
            let processedFormula = formula;
            const cellRefs = formula.match(/[A-G][1-5]/g) || [];
            
            cellRefs.forEach(cellRef => {
                const cellValue = getCellValue(cellRef);
                // Reemplazar solo referencias completas de celdas, no partes de texto
                processedFormula = processedFormula.replace(
                    new RegExp('\\b' + cellRef + '\\b', 'g'), 
                    cellValue
                );
            });
            
            // Evaluar la fórmula procesada
            try {
                return eval(processedFormula);
            } catch (error) {
                console.error('Error evaluando fórmula:', error);
                return '#ERROR';
            }
        }
        
        // Función para obtener los valores de un rango de celdas
        function getRangeValues(range) {
            const values = [];
            const [start, end] = range.split(':').map(cell => cell.trim());
            
            // Extraer columnas y filas
            const startCol = start.charAt(0);
            const startRow = parseInt(start.substring(1));
            const endCol = end.charAt(0);
            const endRow = parseInt(end.substring(1));
            
            // Recorrer el rango
            for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
                for (let row = startRow; row <= endRow; row++) {
                    const cellId = `${String.fromCharCode(col)}${row}`;
                    const value = getCellValue(cellId);
                    if (!isNaN(parseFloat(value))) {
                        values.push(parseFloat(value));
                    }
                }
            }
            
            return values;
        }
        
        // Función para sumar un rango de celdas
        function sumRange(range) {
            const values = getRangeValues(range);
            return values.reduce((sum, value) => sum + value, 0);
        }
        
        // Función para contar celdas numéricas en un rango
        function countRange(range) {
            return getRangeValues(range).length;
        }
        
        // Función para recalcular todas las celdas con fórmulas
        function recalculateAllFormulas() {
            // Primero, guardar todas las fórmulas actuales
            const formulasToEvaluate = {...cellFormulas};
            
            // Luego, evaluar cada fórmula y actualizar la celda correspondiente
            Object.entries(formulasToEvaluate).forEach(([cellId, formula]) => {
                if (formula && formula.startsWith('=')) {
                    const result = evaluateFormula(formula.substring(1));
                    cellValues[cellId] = result;
                    
                    // Actualizar la visualización de la celda
                    const [col, row] = [cellId.charAt(0), cellId.substring(1)];
                    const rowIndex = parseInt(row) - 1;
                    const colIndex = col.charCodeAt(0) - 'A'.charCodeAt(0) + 1; // +1 porque la primera columna es el encabezado
                    
                    const cell = document.querySelector(`.excel-row:nth-child(${rowIndex + 1}) .excel-cell:nth-child(${colIndex})`);
                    if (cell) {
                        cell.textContent = result;
                        cell.setAttribute('data-formula', formula);
                    }
                }
            });
        }
        
        // Selección de celda activa
        excelCells.forEach(cell => {
            cell.addEventListener('focus', function() {
                // Obtener coordenadas de la celda
                const row = this.parentElement.querySelector('.excel-row-header').textContent;
                const colIndex = Array.from(this.parentElement.children).indexOf(cell);
                const col = document.querySelectorAll('.excel-header-cell')[colIndex].textContent;
                const cellId = `${col}${row}`;
                
                // Mostrar la fórmula si existe
                const formula = cellFormulas[cellId];
                if (formula) {
                    this.textContent = formula;
                }
                
                // Actualizar la barra de estado
                const statusBar = this.closest('.window').querySelector('.status-bar');
                if (statusBar) {
                    statusBar.querySelector('span:nth-child(2)').textContent = `Celda: ${cellId}`;
                }
            });
            
            // Guardar el valor al salir de la celda
            cell.addEventListener('blur', function() {
                const row = this.parentElement.querySelector('.excel-row-header').textContent;
                const colIndex = Array.from(this.parentElement.children).indexOf(cell);
                const col = document.querySelectorAll('.excel-header-cell')[colIndex].textContent;
                const cellId = `${col}${row}`;
                const value = this.textContent.trim();
                
                if (value.startsWith('=')) {
                    // Es una fórmula
                    cellFormulas[cellId] = value;
                    const formulaResult = evaluateFormula(value.substring(1));
                    cellValues[cellId] = formulaResult;
                    this.textContent = formulaResult;
                    this.setAttribute('data-formula', value);
                    
                    // Recalcular otras fórmulas que puedan depender de esta celda
                    recalculateAllFormulas();
                } else {
                    // Es un valor normal
                    cellValues[cellId] = isNaN(parseFloat(value)) ? value : parseFloat(value);
                    cellFormulas[cellId] = '';
                    this.removeAttribute('data-formula');
                }
            });
            
            // Mostrar la fórmula al hacer doble clic
            cell.addEventListener('dblclick', function() {
                const row = this.parentElement.querySelector('.excel-row-header').textContent;
                const colIndex = Array.from(this.parentElement.children).indexOf(cell);
                const col = document.querySelectorAll('.excel-header-cell')[colIndex].textContent;
                const cellId = `${col}${row}`;
                const formula = cellFormulas[cellId];
                
                if (formula) {
                    this.textContent = formula;
                }
            });
        });
        
        // Añadir barra de fórmulas y funciones matemáticas
        const excelToolbar = document.querySelector('#excel .formatting-toolbar');
        if (excelToolbar) {
            // Crear contenedor para la barra de fórmulas
            const formulaBar = document.createElement('div');
            formulaBar.classList.add('formula-bar');
            
            // Botón principal para insertar fórmula
            const formulaButton = document.createElement('button');
            formulaButton.classList.add('format-btn', 'formula-btn');
            formulaButton.textContent = 'fx';
            formulaButton.title = 'Insertar fórmula';
            formulaBar.appendChild(formulaButton);
            
            // Crear menú desplegable para funciones
            const formulaMenu = document.createElement('div');
            formulaMenu.classList.add('formula-menu');
            formulaMenu.style.display = 'none';
            
            // Agrupar funciones por categorías
            const formulaCategories = {
                'Matemáticas': ['SUM', 'AVERAGE', 'MAX', 'MIN', 'COUNT', 'POWER', 'SQRT', 'ROUND', 'ABS'],
                'Trigonometría': ['PI', 'SIN', 'COS', 'TAN'],
                'Logarítmicas': ['LOG', 'LN'],
                'Lógicas': ['IF']
            };
            
            // Descripción de cada función
            const formulaDescriptions = {
                'SUM': 'Suma los valores en un rango de celdas. Ejemplo: =SUM(A1:A5)',
                'AVERAGE': 'Calcula el promedio de un rango de celdas. Ejemplo: =AVERAGE(B1:B5)',
                'MAX': 'Encuentra el valor máximo en un rango. Ejemplo: =MAX(C1:C5)',
                'MIN': 'Encuentra el valor mínimo en un rango. Ejemplo: =MIN(D1:D5)',
                'COUNT': 'Cuenta el número de celdas con valores numéricos. Ejemplo: =COUNT(A1:A5)',
                'IF': 'Evaluación condicional. Ejemplo: =IF(A1>10,"Mayor","Menor")',
                'POWER': 'Eleva un número a una potencia. Ejemplo: =POWER(2,3)',
                'SQRT': 'Calcula la raíz cuadrada. Ejemplo: =SQRT(16)',
                'ROUND': 'Redondea a un número de decimales. Ejemplo: =ROUND(3.14159,2)',
                'ABS': 'Valor absoluto. Ejemplo: =ABS(-10)',
                'PI': 'Devuelve el valor de PI. Ejemplo: =PI()',
                'SIN': 'Seno de un ángulo en radianes. Ejemplo: =SIN(PI()/2)',
                'COS': 'Coseno de un ángulo en radianes. Ejemplo: =COS(PI())',
                'TAN': 'Tangente de un ángulo en radianes. Ejemplo: =TAN(PI()/4)',
                'LOG': 'Logaritmo en base 10. Ejemplo: =LOG(100)',
                'LN': 'Logaritmo natural (base e). Ejemplo: =LN(2.718)'
            };
            
            // Crear elementos del menú para cada categoría
            for (const [category, functions] of Object.entries(formulaCategories)) {
                const categoryHeader = document.createElement('div');
                categoryHeader.classList.add('formula-category');
                categoryHeader.textContent = category;
                formulaMenu.appendChild(categoryHeader);
                
                functions.forEach(func => {
                    const functionItem = document.createElement('div');
                    functionItem.classList.add('formula-item');
                    functionItem.setAttribute('data-function', func);
                    functionItem.textContent = func;
                    functionItem.title = formulaDescriptions[func] || '';
                    
                    functionItem.addEventListener('click', function() {
                        const activeCell = document.activeElement;
                        if (activeCell && activeCell.classList.contains('excel-cell')) {
                            // Insertar la función con paréntesis
                            activeCell.textContent = '=' + func + '()';
                            
                            // Posicionar el cursor entre los paréntesis
                            const range = document.createRange();
                            const sel = window.getSelection();
                            const textNode = activeCell.childNodes[0] || activeCell;
                            const cursorPos = activeCell.textContent.length - 1;
                            
                            range.setStart(textNode, cursorPos);
                            range.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(range);
                            
                            // Ocultar el menú
                            formulaMenu.style.display = 'none';
                        }
                    });
                    
                    formulaMenu.appendChild(functionItem);
                });
            }
            
            // Añadir el menú al documento
            document.body.appendChild(formulaMenu);
            
            // Mostrar/ocultar el menú al hacer clic en el botón de fórmula
            formulaButton.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const activeCell = document.activeElement;
                if (activeCell && activeCell.classList.contains('excel-cell')) {
                    if (formulaMenu.style.display === 'none') {
                        // Posicionar el menú debajo del botón
                        const buttonRect = formulaButton.getBoundingClientRect();
                        formulaMenu.style.top = (buttonRect.bottom + window.scrollY) + 'px';
                        formulaMenu.style.left = (buttonRect.left + window.scrollX) + 'px';
                        
                        // Mostrar el menú
                        formulaMenu.style.display = 'block';
                    } else {
                        // Ocultar el menú
                        formulaMenu.style.display = 'none';
                        
                        // Insertar el signo igual
                        activeCell.textContent = '=';
                        
                        // Posicionar el cursor al final
                        const range = document.createRange();
                        const sel = window.getSelection();
                        range.setStart(activeCell.childNodes[0] || activeCell, activeCell.childNodes[0] ? activeCell.childNodes[0].length : 0);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            });
            
            // Ocultar el menú al hacer clic fuera de él
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.formula-menu') && !e.target.closest('.formula-btn')) {
                    formulaMenu.style.display = 'none';
                }
            });
            
            // Añadir la barra de fórmulas al toolbar
            excelToolbar.appendChild(formulaBar);
            
            // Añadir campo de texto para la fórmula activa
            const formulaInput = document.createElement('input');
            formulaInput.type = 'text';
            formulaInput.classList.add('formula-input');
            formulaInput.placeholder = 'Ingrese una fórmula...';
            formulaBar.appendChild(formulaInput);
            
            // Sincronizar el campo de texto con la celda activa
            document.addEventListener('click', function(e) {
                const activeCell = document.activeElement;
                if (activeCell && activeCell.classList.contains('excel-cell')) {
                    const row = activeCell.parentElement.querySelector('.excel-row-header').textContent;
                    const colIndex = Array.from(activeCell.parentElement.children).indexOf(activeCell);
                    const col = document.querySelectorAll('.excel-header-cell')[colIndex].textContent;
                    const cellId = `${col}${row}`;
                    
                    // Mostrar la fórmula en el campo de texto si existe
                    formulaInput.value = cellFormulas[cellId] || activeCell.textContent;
                }
            });
            
            // Actualizar la celda cuando se modifica el campo de texto
            formulaInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    const activeCell = document.activeElement;
                    if (activeCell && activeCell.classList.contains('excel-cell')) {
                        activeCell.textContent = this.value;
                        const event = new Event('blur');
                        activeCell.dispatchEvent(event);
                    }
                    this.blur();
                }
            });
        }
    }
    
    // Funcionalidad para PowerPoint
    const slideEditor = document.querySelector('.slide-editor');
    const slideThumbnails = document.querySelectorAll('.slide-thumbnail');
    let slides = []; // Almacena el contenido de las diapositivas
    
    if (slideEditor && slideThumbnails.length > 0) {
        // Inicializar la primera diapositiva
        slides.push({
            id: 1,
            title: 'Haz clic para añadir título',
            subtitle: 'Haz clic para añadir subtítulo',
            content: ''
        });
        
        // Función para mostrar una diapositiva
        function showSlide(slideIndex) {
            const slide = slides[slideIndex - 1];
            if (!slide) return;
            
            // Actualizar el contenido del editor
            const slideContent = `
                <div class="slide" data-slide-id="${slide.id}" contenteditable="true">
                    <h1>${slide.title}</h1>
                    <h3>${slide.subtitle}</h3>
                    <div class="slide-content">${slide.content}</div>
                </div>
            `;
            slideEditor.innerHTML = slideContent;
            
            // Actualizar la barra de estado
            const statusBar = document.querySelector('#powerpoint .status-bar');
            if (statusBar) {
                statusBar.querySelector('span:first-child').textContent = `Diapositiva ${slideIndex} de ${slides.length}`;
            }
            
            // Activar la miniatura correspondiente
            document.querySelectorAll('.slide-thumbnail').forEach((thumb, idx) => {
                if (idx === slideIndex - 1 && !thumb.classList.contains('new-slide-btn')) {
                    thumb.classList.add('active');
                } else if (!thumb.classList.contains('new-slide-btn')) {
                    thumb.classList.remove('active');
                }
            });
            
            // Añadir eventos para editar el contenido
            const slideElement = slideEditor.querySelector('.slide');
            if (slideElement) {
                // Guardar cambios en el título
                const titleElement = slideElement.querySelector('h1');
                if (titleElement) {
                    titleElement.addEventListener('blur', function() {
                        slides[slideIndex - 1].title = this.textContent;
                    });
                }
                
                // Guardar cambios en el subtítulo
                const subtitleElement = slideElement.querySelector('h3');
                if (subtitleElement) {
                    subtitleElement.addEventListener('blur', function() {
                        slides[slideIndex - 1].subtitle = this.textContent;
                    });
                }
                
                // Guardar cambios en el contenido
                const contentElement = slideElement.querySelector('.slide-content');
                if (contentElement) {
                    contentElement.addEventListener('blur', function() {
                        slides[slideIndex - 1].content = this.innerHTML;
                    });
                }
            }
        }
        
        // Añadir nueva diapositiva
        const newSlideBtn = document.querySelector('.slide-thumbnail:last-child');
        if (newSlideBtn) {
            // Marcar el botón de nueva diapositiva
            newSlideBtn.classList.add('new-slide-btn');
            
            newSlideBtn.addEventListener('click', function() {
                // Crear nueva diapositiva en el array
                const newSlideId = slides.length + 1;
                slides.push({
                    id: newSlideId,
                    title: 'Nueva diapositiva',
                    subtitle: 'Añade un subtítulo',
                    content: ''
                });
                
                // Crear nueva miniatura
                const newThumbnail = document.createElement('div');
                newThumbnail.classList.add('slide-thumbnail');
                newThumbnail.setAttribute('data-slide-id', newSlideId);
                newThumbnail.textContent = `Diapositiva ${newSlideId}`;
                
                // Insertar antes del botón de nueva diapositiva
                this.parentNode.insertBefore(newThumbnail, this);
                
                // Añadir evento de clic a la nueva miniatura
                newThumbnail.addEventListener('click', function() {
                    const slideId = parseInt(this.getAttribute('data-slide-id'));
                    showSlide(slideId);
                });
                
                // Mostrar la nueva diapositiva
                showSlide(newSlideId);
            });
        }
        
        // Activar la primera diapositiva por defecto
        const firstSlide = document.querySelector('.slide-thumbnail:first-child');
        if (firstSlide) {
            firstSlide.classList.add('active');
            firstSlide.setAttribute('data-slide-id', '1');
            
            // Añadir evento de clic a la primera miniatura
            firstSlide.addEventListener('click', function() {
                showSlide(1);
            });
            
            // Mostrar la primera diapositiva
            showSlide(1);
        }
        
        // Añadir botones para diseños de diapositivas
        const pptToolbar = document.querySelector('#powerpoint .formatting-toolbar');
        if (pptToolbar) {
            const layoutsDiv = document.createElement('div');
            layoutsDiv.classList.add('slide-layouts');
            layoutsDiv.innerHTML = `
                <button class="layout-btn" data-layout="title">Título</button>
                <button class="layout-btn" data-layout="title-content">Título y contenido</button>
                <button class="layout-btn" data-layout="two-content">Dos contenidos</button>
            `;
            pptToolbar.appendChild(layoutsDiv);
            
            // Añadir eventos a los botones de diseño
            const layoutButtons = document.querySelectorAll('.layout-btn');
            layoutButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const layout = this.getAttribute('data-layout');
                    const activeSlideId = parseInt(document.querySelector('.slide-thumbnail.active').getAttribute('data-slide-id'));
                    
                    // Aplicar el diseño seleccionado
                    switch(layout) {
                        case 'title':
                            slides[activeSlideId - 1].content = '';
                            break;
                        case 'title-content':
                            slides[activeSlideId - 1].content = '<p>Haz clic para añadir contenido</p>';
                            break;
                        case 'two-content':
                            slides[activeSlideId - 1].content = `
                                <div class="two-column">
                                    <div class="column">Contenido izquierdo</div>
                                    <div class="column">Contenido derecho</div>
                                </div>
                            `;
                            break;
                    }
                    
                    // Actualizar la vista
                    showSlide(activeSlideId);
                });
            });
        }
    }
});