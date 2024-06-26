# 一文详解JavaScript中的内存机制

对于我们前端开发人员来说，JavaScript的内存机制是一个不怎么被提及的概念。但是，若我们想在前端这条路上走的更远，并且我们想打造高性能的前端应用，那么搞懂**JavaScript中的内存机制**将会变得十分重要。接下来，我们将分三块内容来深入剖析JavaScript的内存机制。

## 数据是如何存储的？

在弄清楚这个问题之前，我们先来看看以下两段代码：

```JavaScript
function foo(){
var a = 1
var b = a
a = 2
console.log(a)
console.log(b)
}
foo()
```

```
function foo(){
var a = {name:"ajh"}
var b = a
a.name = "小豪"
console.log(a)
console.log(b)
}
foo()
```

第一段代码的输出结果：a为2，b为1，这很好理解。但当我们执行第二段代码时，我们仅仅改变了a中的name属性值，但是最后的打印结果却都是{name:"小豪"}，这与我们的预期不一致。那么，为什么会产生这一现象呢？要探究这个原因，那我们先得从JavaScript语言的本身特性讲起。

### JavaScript是什么类型的语言？

每种编程语言都具有内建的数据类型，但它们的数据类型常有不同之处，且使用方式也各有差异。以C语言为例：

```C
int main()
{
int a = 1;
char* b = "小豪";
bool c = true;
return 0;
}
```

上述代码声明变量的特点是：**在声明之前要先定义变量类型**。我们把有这种特性的语言称之为**静态语言**。相反的，我们把**在运行过程中检查变量类型的语言称之为动态语言**。而JavaScript就是动态语言，因为在声明变量之前并不需要定义类型（当然TypeScript很好的补足了类型这一特性，本文暂且不表）。

不过，虽然C和JavaScript是静态语言，但是我们可以将其他类型的变量赋值给另外一个(不同类型)的变量。示例如下：

```javascript
let a = 1
let b = false
a = b
console.log(a)
```

以上代码会顺利通过编译，并且打印false。在将变量b赋值给a的过程中，JS引擎会把number类型的变量a转换为变量b的boolean类型。我们把这种类型转换称之为**隐式类型转换**。而支持**隐式类型转换**的语言被称为**弱类型语言**。

与之相对的，还有强类型语言。我们以Java为例：

```java
int num = "hello"; // 编译错误：类型不匹配
```

```java
int num = 1
String str = "1"
num = str // 编译错误：类型不匹配
```

以上两段代码，会直接在编译期就抛出错误，无法进行后续的执行。因为强类型语言的Java是不支持隐式类型转换的，若类型不匹配则会抛出对应的错误。

而对于各种语言的类型，我们可以参考下图：

![image-20240317212335743](/image-20240317212335743.png)

最后，做个总结：

JavaScript是一种**动态的**、**弱类型**的语言，这意味着我们在编写JavaScript代码时：

- 无需定义类型，JS引擎在执行代码时会替我们计算出来；
- 可以使用同一个变量保存多种类型的数据

### JavaScript如何存储不同类型的数据？

当我们了解完JavaScript的语言特性后，回过头来看看JS中的数据类型。主要分为两个大类：

| 基本类型（7种）                                          | 引用类型 |
| -------------------------------------------------------- | -------- |
| Number、String、Boolean、Undefined、Null、BigInt、Symbol | Object   |

而这两个大类在内存中的存储方式也是不同的。要想知道不同类型的数据在内存中是如何存储的，我们得先了解一下JS的内存模型：

<img src="/image-20240317215650907.png" alt="image-20240317215650907" style="zoom:25%;" />

代码空间主要用于存储可执行代码，本文暂且按下不表。

#### 栈与堆

这里的栈其实指的就是JavaScript中的函数调用栈，用于存储执行上下文。

而当我们声明了一个函数时，该函数会被压入栈中；函数执行完毕，则被弹出调用栈。

```js
function foo(){
var a = "小豪"
var b = a
var c = {name:"小豪"}
var d = c
}
foo()
```

针对以上这段代码，它在堆栈空间中的分布是这样的：

![函数堆栈空间](/stackAndHeap.png)

可以看到，我们对变量c的操作同样也会影响到变量d。因为归根结底，在内存分布中，变量c、d本质上指向了**堆空间**中的同一个对象。

我们来做个总结：

- 对于基本数据类型，它们的值会直接存储在栈空间中
- 对于引用数据类型，它们的值不是直接存储在栈空间中的，而是存储在堆空间中；栈空间中存储的是对该值的**引用**，也就是地址值

#### 为何要区分堆栈空间？

通过以上内容我们了解了堆与栈。那么，为什么JS要对数据类型的存储做堆、栈两个存储空间的区分呢？就不能把所有数据都存储在栈中或者堆中吗？

其实，不光是JS对数据的存储做了堆、栈空间的区分，其他很多编程语言也是如此。例如Java、C、GoLang等。其实，这么做是出于以下几个考量：

- **数据访问效率**：栈空间中的数据存储在连续的内存区域中，访问速度相对较快，可以直接通过移动指针来快速切换当前执行上下文；而堆空间中的数据则存储在离散的内存块中，访问速度相对较慢，需要通过引用来访问，需要额外的寻址操作
- **内存管理效率**：栈空间用于存储基本数据类型和引用的指针，由系统自动管理内存的分配和释放，具有**快速的分配和释放速度**，适合于存储生命周期短暂的数据。而堆空间则用于存储引用类型的数据，这些数据的大小不固定，需要动态分配内存，通过手动管理内存分配和释放，使得程序具有更大的灵活性。
- **内存利用率和碎片化**：栈空间的大小是固定的，但堆空间的大小可以动态调整，根据需要动态分配内存，提高了内存的利用率。同时，通过手动管理堆空间中的内存分配和释放，可以减少内存的碎片化，避免因为频繁的内存分配和释放而导致内存空间的浪费。

## 再谈闭包

在了解完JS的数据类型在内存中的存储后，我们再从内存模型的角度来谈谈闭包。

首先，快速过一下闭包的基本定义：

**闭包（Closure）**是指：**在一个函数内部定义的函数**可以访问该函数所在的作用域，**即使在其父函数执行完毕后仍然可以访问**。

仅看定义可能会比较抽象，我们直接上代码：

```js
function outer() {
   var outerVariable = 'I am outer!';
  
   function inner() {
      console.log(outerVariable); // 内部函数可以访问外部函数作用域中的变量
   }

   return inner;
}

var closure = outer();
closure(); // 输出：I am outer!
```

可以看到，我们在外部函数`outer`中创建了内部函数`inner`，且内部函数引用了外部函数作用域中的变量`outerVariable`。

那么，根据V8的垃圾回收机制（具体我们放到其他文章中再做讲解，这里你只需知道当函数/变量执行完毕后，若没有被其他地方引用时，则会被销毁），当外部函数`outer`执行完毕后，它对应的执行上下文也将被销毁，其内部的变量按理来说也应该被销毁。但是由于闭包的特性，导致变量`outerVariable`实际上其实并不会被销毁。那么，这个变量存放在哪里了呢？我们又该如何解释这一现象呢？

我们可以启动浏览器的断点调试功能，直接查看闭包：

![image-20240331192416795](/image-20240331192416795.png)

我们直接从内存模型的角度来分析一下这段代码：

1. 当JavaScript执行到outer函数时，编译并创建对应的函数执行上下文
2. 编译过程中，发现了inner函数（第16行），且该inner函数引用了outer函数中的变量；因此**JS引擎判断这是一个闭包，于是在堆空间中创建了`Closure(outer)`对象**，对象中的内容正是`outerVariable`。
3. 执行outer函数，执行完毕后销毁outer函数的执行上下文；但是返回的inner函数拥有对`Closure(outer)`对象的引用，可以继续访问闭包变量

## 总结

在本文中，我们深入探讨了JavaScript内存机制的奥秘，从而为前端开发者提供了提升代码性能的关键知识。我们首先通过实例代码揭示了基本数据类型与引用数据类型在内存中的存储差异，进而阐述了JavaScript作为动态弱类型语言的灵活性，允许我们在声明变量时无需指定类型，并且支持隐式类型转换。这种特性虽然为开发带来了便利，但也要求开发者对内存的存储和分配有更深入的理解。

文章进一步深入到JavaScript的内存模型，特别是栈和堆的角色及其对数据存储的影响。我们了解到，栈空间的高效访问速度和固定生命周期使其成为存储基本数据类型的合适场所，而堆空间的动态分配特性则非常适合存储大小不固定的引用数据类型。这种内存分配策略不仅提高了内存使用效率，还有助于减少内存碎片化，从而优化了整体性能。

最后，文章通过闭包的概念，展示了如何通过内部函数访问外部函数作用域中的变量，即使外部函数已经执行完毕。这一部分不仅揭示了闭包在内存中的工作机制，也强调了闭包对变量生命周期的重要影响，为开发者在使用闭包时提供了宝贵的参考。

综上所述，本文为读者呈现了一幅JavaScript内存管理的清晰图景，强调了理解内存机制在开发高性能前端应用中的重要性。通过这些知识，开发者可以更加精准地控制内存使用，编写出更加高效和健壮的代码，从而在前端开发的道路上走得更远。